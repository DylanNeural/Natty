import React, { useMemo, useState } from "react";

interface Props {
  onBack: () => void;
}

type TestStatus = "ok" | "warn" | "error";

type TestItem = {
  name: string;
  status: TestStatus;
  summary: string;
};

type ChatbotApiResponse = {
  ok?: boolean;
  conversationId?: string;
  reply?: string;
  detectedIntent?: string;
  suggestions?: string[];
  disclaimer?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

const statusClasses: Record<TestStatus, string> = {
  ok: "text-green-600 dark:text-green-400",
  warn: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
};

const DEFAULT_TEST_EMAIL = "dylan-psupp@outlook.fr";
const DEFAULT_TEST_PASSWORD = "rootroot";

function normalizeApiBaseUrl(rawUrl?: string) {
  const fallback = "http://localhost:5000";
  const value = (rawUrl || fallback).trim();
  return value.replace(/\/+$/, "");
}

const API_URL = normalizeApiBaseUrl(
  (import.meta as any).env?.VITE_API_URL as string | undefined
);

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

export const TestScreen: React.FC<Props> = ({ onBack }) => {
  const [running, setRunning] = useState(false);
  const [runningRealLogin, setRunningRealLogin] = useState(false);
  const [runningRealRegister, setRunningRealRegister] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<TestItem[]>([]);
  const [testName, setTestName] = useState("Dylan Test");
  const [testEmail, setTestEmail] = useState(DEFAULT_TEST_EMAIL);
  const [testPassword, setTestPassword] = useState(DEFAULT_TEST_PASSWORD);

  const [token, setToken] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [message, setMessage] = useState(
    "Est-ce que ce produit est adapte a une prise de masse propre ?"
  );
  const [productContextText, setProductContextText] = useState("");
  const [chatbotLoading, setChatbotLoading] = useState(false);
  const [chatbotResponse, setChatbotResponse] =
    useState<ChatbotApiResponse | null>(null);
  const [chatbotHistory, setChatbotHistory] = useState<unknown>(null);
  const [chatbotError, setChatbotError] = useState<string | null>(null);

  const logsText = useMemo(() => logs.join("\n"), [logs]);

  const parsedProductContext = useMemo(() => {
    if (!productContextText.trim()) return null;
    try {
      return JSON.parse(productContextText);
    } catch {
      return "__INVALID_JSON__";
    }
  }, [productContextText]);

  const appendLog = (line: string) => {
    const stamp = new Date().toISOString();
    setLogs((prev) => [...prev, `[${stamp}] ${line}`]);
  };

  const pushResult = (name: string, status: TestStatus, summary: string) => {
    setResults((prev) => [...prev, { name, status, summary }]);
  };

  const parseBody = (raw: string) => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  };

  const redactSensitiveBody = (rawBody: string) => {
    try {
      const parsed = JSON.parse(rawBody) as Record<string, unknown>;
      const redacted = { ...parsed };
      if ("password" in redacted) redacted.password = "***";
      if ("captchaToken" in redacted) redacted.captchaToken = "***";
      if ("token" in redacted) redacted.token = "***";
      return JSON.stringify(redacted);
    } catch {
      return rawBody;
    }
  };

  const readImportantHeaders = (res: Response) => {
    return {
      "access-control-allow-origin":
        res.headers.get("access-control-allow-origin") || "(absent)",
      "access-control-allow-credentials":
        res.headers.get("access-control-allow-credentials") || "(absent)",
      "set-cookie":
        res.headers.get("set-cookie") || "(non lisible depuis navigateur)",
      "content-type": res.headers.get("content-type") || "(absent)",
    };
  };

  const runRequest = async (
    name: string,
    path: string,
    init: RequestInit = {},
    evaluator?: (
      res: Response,
      body: unknown
    ) => { status: TestStatus; summary: string }
  ) => {
    const method = (init.method || "GET").toUpperCase();
    const url = buildApiUrl(path);

    appendLog(`\n=== ${name} ===`);
    appendLog(`REQ ${method} ${url}`);
    appendLog(`REQ credentials=${init.credentials || "same-origin"}`);
    if (init.headers) {
      appendLog(`REQ headers=${JSON.stringify(init.headers)}`);
    }
    if (typeof init.body === "string") {
      appendLog(`REQ body=${redactSensitiveBody(init.body).slice(0, 500)}`);
    }

    try {
      const res = await fetch(url, init);
      const raw = await res.text();
      const parsedBody = parseBody(raw);
      const headers = readImportantHeaders(res);

      appendLog(`RES status=${res.status} ${res.statusText}`);
      appendLog(`RES headers=${JSON.stringify(headers)}`);
      appendLog(
        `RES body=${
          typeof parsedBody === "string"
            ? parsedBody.slice(0, 800)
            : JSON.stringify(parsedBody).slice(0, 800)
        }`
      );

      if (evaluator) {
        const { status, summary } = evaluator(res, parsedBody);
        pushResult(name, status, summary);
      } else {
        pushResult(
          name,
          res.ok ? "ok" : "warn",
          res.ok ? "Reponse OK" : `HTTP ${res.status}`
        );
      }

      return { res, body: parsedBody };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      appendLog(`RES network-error=${message}`);
      pushResult(
        name,
        "error",
        "Erreur reseau/CORS (requete bloquee ou backend inaccessible)"
      );
      return null;
    }
  };

  const runAllTests = async () => {
    setRunning(true);
    setLogs([]);
    setResults([]);

    appendLog("Demarrage des diagnostics frontend -> backend");
    appendLog(`Frontend origin=${window.location.origin}`);
    appendLog(`Backend base URL=${API_URL}`);
    appendLog(`UA=${navigator.userAgent}`);

    await runRequest("Health root", "/", {}, (res) => ({
      status: res.ok ? "ok" : "error",
      summary: res.ok ? "Backend joignable" : `Backend KO (${res.status})`,
    }));

    const csrfResponse = await runRequest(
      "CSRF token",
      "/api/csrf-token",
      { method: "GET", credentials: "include" },
      (res, body) => {
        const tokenValue =
          typeof body === "object" && body
            ? (body as { csrfToken?: string }).csrfToken
            : undefined;
        if (!res.ok) {
          return {
            status: "error",
            summary: `Echec recuperation CSRF (${res.status})`,
          };
        }
        if (!tokenValue) {
          return { status: "error", summary: "Pas de csrfToken dans la reponse" };
        }
        return { status: "ok", summary: "csrfToken recupere" };
      }
    );

    const csrfToken =
      csrfResponse &&
      csrfResponse.body &&
      typeof csrfResponse.body === "object" &&
      (csrfResponse.body as { csrfToken?: string }).csrfToken
        ? (csrfResponse.body as { csrfToken?: string }).csrfToken!
        : "";

    await runRequest(
      "Register probe (fake captcha)",
      "/api/auth/register",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({
          name: "test user",
          email: `test-${Date.now()}@example.com`,
          password: "password123",
          captchaToken: "fake-token",
        }),
      },
      (res, body) => {
        const text =
          typeof body === "string" ? body : JSON.stringify(body || {});
        if (res.status === 403 && text.toLowerCase().includes("csrf")) {
          return {
            status: "error",
            summary: "CSRF rejete (cookie/header manquant)",
          };
        }
        if (res.status === 403 && text.toLowerCase().includes("captcha")) {
          return {
            status: "ok",
            summary: "Route auth OK (captcha bloque normalement)",
          };
        }
        if (res.status >= 500) {
          return {
            status: "error",
            summary: `Erreur serveur (${res.status}) sur auth/register`,
          };
        }
        if (res.ok) {
          return { status: "ok", summary: "Register fonctionne" };
        }
        return { status: "warn", summary: `Reponse inattendue (${res.status})` };
      }
    );

    await runRequest(
      "Login probe (fake captcha)",
      "/api/auth/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({
          email: "nobody@example.com",
          password: "password123",
          captchaToken: "fake-token",
        }),
      },
      (res, body) => {
        const text =
          typeof body === "string" ? body : JSON.stringify(body || {});
        if (res.status === 403 && text.toLowerCase().includes("csrf")) {
          return { status: "error", summary: "CSRF rejete sur login" };
        }
        if (res.status === 403 && text.toLowerCase().includes("captcha")) {
          return {
            status: "ok",
            summary: "Route login OK (captcha bloque normalement)",
          };
        }
        if (res.status >= 500) {
          return {
            status: "error",
            summary: `Erreur serveur (${res.status}) sur auth/login`,
          };
        }
        if (res.status === 401) {
          return {
            status: "ok",
            summary: "Route login repond (identifiants invalides attendus)",
          };
        }
        return { status: "warn", summary: `Reponse inattendue (${res.status})` };
      }
    );

    await runRequest(
      "Profile probe (fake JWT)",
      "/api/profile/me",
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Bearer fake.jwt.token",
        },
      },
      (res) => {
        if (res.status === 401 || res.status === 403) {
          return {
            status: "ok",
            summary: "Route profile joignable (auth rejetee normalement)",
          };
        }
        if (res.status >= 500) {
          return {
            status: "error",
            summary: `Erreur serveur (${res.status}) sur profile`,
          };
        }
        return { status: "warn", summary: `Reponse inattendue (${res.status})` };
      }
    );

    appendLog("\nDiagnostics termines");
    setRunning(false);
  };

  const runRealLoginTest = async () => {
    if (!testEmail.trim() || !testPassword) {
      pushResult("Login reel (Dylan)", "error", "Email/mot de passe manquant");
      appendLog("Login reel annule: email ou mot de passe manquant");
      return;
    }

    setRunningRealLogin(true);

    const csrfResponse = await runRequest(
      "CSRF token (login reel)",
      "/api/csrf-token",
      { method: "GET", credentials: "include" },
      (res, body) => {
        const tokenValue =
          typeof body === "object" && body
            ? (body as { csrfToken?: string }).csrfToken
            : undefined;
        if (!res.ok || !tokenValue) {
          return {
            status: "error",
            summary: "Impossible de recuperer CSRF pour login reel",
          };
        }
        return { status: "ok", summary: "CSRF OK pour login reel" };
      }
    );

    const csrfToken =
      csrfResponse &&
      csrfResponse.body &&
      typeof csrfResponse.body === "object" &&
      (csrfResponse.body as { csrfToken?: string }).csrfToken
        ? (csrfResponse.body as { csrfToken?: string }).csrfToken!
        : "";

    await runRequest(
      "Login reel (Dylan)",
      "/api/auth/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({
          email: testEmail.trim(),
          password: testPassword,
          captchaToken: "bypass-token",
        }),
      },
      (res, body) => {
        const text =
          typeof body === "string" ? body : JSON.stringify(body || {});
        if (
          res.ok &&
          typeof body === "object" &&
          body &&
          (body as { token?: string }).token
        ) {
          return { status: "ok", summary: "Connexion reelle OK (token recu)" };
        }
        if (res.status === 403 && text.toLowerCase().includes("captcha")) {
          return {
            status: "error",
            summary:
              "Captcha refuse: active RECAPTCHA_BYPASS=true cote backend",
          };
        }
        if (res.status === 403 && text.toLowerCase().includes("csrf")) {
          return { status: "error", summary: "CSRF rejete sur login reel" };
        }
        if (res.status === 401) {
          return { status: "error", summary: "Identifiants invalides" };
        }
        if (res.status >= 500) {
          return {
            status: "error",
            summary: `Erreur serveur (${res.status}) sur login reel`,
          };
        }
        return { status: "warn", summary: `Reponse inattendue (${res.status})` };
      }
    );

    setRunningRealLogin(false);
  };

  const runRealRegisterTest = async () => {
    if (!testName.trim() || !testEmail.trim() || !testPassword) {
      pushResult(
        "Inscription reelle (Dylan)",
        "error",
        "Nom/email/mot de passe manquant"
      );
      appendLog(
        "Inscription reelle annulee: nom, email ou mot de passe manquant"
      );
      return;
    }

    setRunningRealRegister(true);

    const csrfResponse = await runRequest(
      "CSRF token (inscription reelle)",
      "/api/csrf-token",
      { method: "GET", credentials: "include" },
      (res, body) => {
        const tokenValue =
          typeof body === "object" && body
            ? (body as { csrfToken?: string }).csrfToken
            : undefined;
        if (!res.ok || !tokenValue) {
          return {
            status: "error",
            summary: "Impossible de recuperer CSRF pour inscription reelle",
          };
        }
        return { status: "ok", summary: "CSRF OK pour inscription reelle" };
      }
    );

    const csrfToken =
      csrfResponse &&
      csrfResponse.body &&
      typeof csrfResponse.body === "object" &&
      (csrfResponse.body as { csrfToken?: string }).csrfToken
        ? (csrfResponse.body as { csrfToken?: string }).csrfToken!
        : "";

    await runRequest(
      "Inscription reelle (Dylan)",
      "/api/auth/register",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
        },
        body: JSON.stringify({
          name: testName.trim(),
          email: testEmail.trim(),
          password: testPassword,
          captchaToken: "bypass-token",
        }),
      },
      (res, body) => {
        const text =
          typeof body === "string" ? body : JSON.stringify(body || {});
        if (
          res.ok &&
          typeof body === "object" &&
          body &&
          (body as { token?: string }).token
        ) {
          return { status: "ok", summary: "Inscription reelle OK (token recu)" };
        }
        if (res.status === 409) {
          return { status: "warn", summary: "Utilisateur deja existant" };
        }
        if (res.status === 403 && text.toLowerCase().includes("captcha")) {
          return {
            status: "error",
            summary:
              "Captcha refuse: active RECAPTCHA_BYPASS=true cote backend",
          };
        }
        if (res.status === 403 && text.toLowerCase().includes("csrf")) {
          return {
            status: "error",
            summary: "CSRF rejete sur inscription reelle",
          };
        }
        if (res.status >= 500) {
          return {
            status: "error",
            summary: `Erreur serveur (${res.status}) sur inscription reelle`,
          };
        }
        return { status: "warn", summary: `Reponse inattendue (${res.status})` };
      }
    );

    setRunningRealRegister(false);
  };

  const copyLogs = async () => {
    if (!logsText) return;
    try {
      await navigator.clipboard.writeText(logsText);
      appendLog("Logs copies dans le presse-papiers");
    } catch {
      appendLog(
        "Impossible de copier automatiquement, copie manuelle depuis la zone de logs"
      );
    }
  };

  async function callChatbotApi(
    path: string,
    method: "GET" | "POST",
    body?: unknown
  ) {
    if (!token.trim()) {
      throw new Error("Token requis (Bearer JWT).");
    }

    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.trim()}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        data?.error?.message || data?.message || `Erreur ${res.status}`
      );
    }
    return data;
  }

  async function handleSendMessage() {
    if (!message.trim()) return;
    if (parsedProductContext === "__INVALID_JSON__") {
      setChatbotError("productContext JSON invalide.");
      return;
    }

    setChatbotLoading(true);
    setChatbotError(null);

    try {
      const payload: Record<string, unknown> = {
        message: message.trim(),
      };
      if (conversationId.trim()) {
        payload.conversationId = conversationId.trim();
      }
      if (parsedProductContext) {
        payload.productContext = parsedProductContext;
      }

      const data = (await callChatbotApi(
        "/api/chatbot/message",
        "POST",
        payload
      )) as ChatbotApiResponse;
      setChatbotResponse(data);
      setConversationId(data.conversationId || conversationId);
    } catch (err: unknown) {
      const e = err as Error;
      setChatbotError(e.message || "Erreur message chatbot.");
    } finally {
      setChatbotLoading(false);
    }
  }

  async function handleResetConversation() {
    setChatbotLoading(true);
    setChatbotError(null);

    try {
      const data = (await callChatbotApi(
        "/api/chatbot/reset",
        "POST",
        {}
      )) as ChatbotApiResponse;
      setConversationId(data.conversationId || "");
      setChatbotResponse(data);
    } catch (err: unknown) {
      const e = err as Error;
      setChatbotError(e.message || "Erreur reset chatbot.");
    } finally {
      setChatbotLoading(false);
    }
  }

  async function handleLoadHistory() {
    setChatbotLoading(true);
    setChatbotError(null);

    try {
      const data = await callChatbotApi("/api/chatbot/history", "GET");
      setChatbotHistory(data);
    } catch (err: unknown) {
      const e = err as Error;
      setChatbotError(e.message || "Erreur history chatbot.");
    } finally {
      setChatbotLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 bg-background-light dark:bg-background-dark overflow-y-auto">
      <div className="text-center mt-2">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">
          Diagnostics backend
        </h1>
        <p className="mt-2 text-sm text-text-light/70 dark:text-text-dark/70">
          Lance les tests puis copie/colle les logs pour debug rapide.
        </p>
      </div>

      <div className="rounded-2xl p-4 bg-white dark:bg-card-dark ring-1 ring-gray-200 dark:ring-gray-800">
        <p className="text-xs text-text-light/70 dark:text-text-dark/70 break-all">
          API_URL: {API_URL}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={runAllTests}
            disabled={running}
            className="rounded-xl px-4 py-2 bg-primary text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {running ? "Tests en cours..." : "Lancer tous les tests"}
          </button>

          <button
            onClick={copyLogs}
            disabled={!logs.length}
            className="rounded-xl px-4 py-2 bg-secondary text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Copier les logs
          </button>

          <button
            onClick={() => {
              setLogs([]);
              setResults([]);
            }}
            className="rounded-xl px-4 py-2 bg-gray-500 text-white text-sm font-semibold"
          >
            Vider
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-white dark:bg-card-dark ring-1 ring-gray-200 dark:ring-gray-800">
        <h2 className="text-sm font-bold text-text-light dark:text-text-dark">
          Test connexion / inscription reelle
        </h2>
        <p className="mt-1 text-xs text-text-light/70 dark:text-text-dark/70">
          Verifie la vraie connexion et inscription avec tes identifiants.
        </p>

        <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
          Necessite RECAPTCHA_BYPASS=true cote backend pour reussir en mode sans
          captcha.
        </p>

        <div className="mt-3 grid gap-2">
          <input
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-text-light dark:text-text-dark"
            placeholder="Nom"
            type="text"
            disabled={running || runningRealLogin || runningRealRegister}
          />
          <input
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-text-light dark:text-text-dark"
            placeholder="Email"
            type="email"
            disabled={running || runningRealLogin || runningRealRegister}
          />
          <input
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-text-light dark:text-text-dark"
            placeholder="Mot de passe"
            type="password"
            disabled={running || runningRealLogin || runningRealRegister}
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={runRealRegisterTest}
              disabled={running || runningRealLogin || runningRealRegister}
              className="rounded-xl px-4 py-2 bg-secondary text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {runningRealRegister
                ? "Test inscription en cours..."
                : "Tester inscription reelle"}
            </button>

            <button
              onClick={runRealLoginTest}
              disabled={running || runningRealLogin || runningRealRegister}
              className="rounded-xl px-4 py-2 bg-primary text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {runningRealLogin
                ? "Test login en cours..."
                : "Tester connexion reelle"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-white dark:bg-card-dark ring-1 ring-gray-200 dark:ring-gray-800">
        <h2 className="text-sm font-bold text-text-light dark:text-text-dark">
          Resultats
        </h2>
        {results.length === 0 ? (
          <p className="mt-2 text-xs text-text-light/70 dark:text-text-dark/70">
            Aucun test lance.
          </p>
        ) : (
          <ul className="mt-2 space-y-1">
            {results.map((result, index) => (
              <li
                key={`${result.name}-${index}`}
                className="text-sm text-text-light dark:text-text-dark"
              >
                <span className={`font-bold ${statusClasses[result.status]}`}>
                  [{result.status.toUpperCase()}]
                </span>{" "}
                {result.name} - {result.summary}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl p-4 bg-white dark:bg-card-dark ring-1 ring-gray-200 dark:ring-gray-800 flex-1 min-h-[260px]">
        <h2 className="text-sm font-bold text-text-light dark:text-text-dark">
          Logs detailles
        </h2>
        <textarea
          value={logsText}
          readOnly
          className="mt-2 w-full min-h-[220px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-xs text-text-light dark:text-text-dark"
          placeholder="Les logs apparaitront ici..."
        />
      </div>

      <div className="rounded-2xl p-4 bg-white dark:bg-card-dark ring-1 ring-gray-200 dark:ring-gray-800">
        <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
          Test Chatbot API
        </h2>
        <p className="mt-1 text-xs text-text-light/70 dark:text-text-dark/70">
          Console de test manuelle pour `/api/chatbot/*`.
        </p>

        <div className="mt-4 grid gap-3">
          <label className="text-xs font-semibold text-text-light dark:text-text-dark">
            Token JWT (Bearer)
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Colle ici le token recu apres login"
            className="min-h-20 rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs bg-white dark:bg-gray-900"
          />

          <label className="text-xs font-semibold text-text-light dark:text-text-dark">
            Conversation ID (optionnel)
          </label>
          <input
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            placeholder="Laisse vide pour en creer une"
            className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-900"
          />

          <label className="text-xs font-semibold text-text-light dark:text-text-dark">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-24 rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-900"
          />

          <label className="text-xs font-semibold text-text-light dark:text-text-dark">
            productContext JSON (optionnel)
          </label>
          <textarea
            value={productContextText}
            onChange={(e) => setProductContextText(e.target.value)}
            placeholder='{"nom":"Skyr","valeurs_nutritionnelles":{"proteines_g":10}}'
            className="min-h-24 rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs bg-white dark:bg-gray-900"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSendMessage}
              disabled={chatbotLoading}
              className="rounded-full px-4 py-2 bg-primary text-white text-xs font-semibold disabled:opacity-60"
            >
              Envoyer message
            </button>
            <button
              onClick={handleResetConversation}
              disabled={chatbotLoading}
              className="rounded-full px-4 py-2 bg-orange-500 text-white text-xs font-semibold disabled:opacity-60"
            >
              Reset conversation
            </button>
            <button
              onClick={handleLoadHistory}
              disabled={chatbotLoading}
              className="rounded-full px-4 py-2 bg-slate-700 text-white text-xs font-semibold disabled:opacity-60"
            >
              Charger history
            </button>
          </div>

          {chatbotError && (
            <pre className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-3 text-xs whitespace-pre-wrap">
              {chatbotError}
            </pre>
          )}

          {chatbotResponse && (
            <pre className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 text-xs whitespace-pre-wrap overflow-auto">
              {JSON.stringify(chatbotResponse, null, 2)}
            </pre>
          )}

          {chatbotHistory && (
            <pre className="rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 text-xs whitespace-pre-wrap overflow-auto">
              {JSON.stringify(chatbotHistory, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <button
        onClick={onBack}
        className="self-center rounded-full px-6 py-3 bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform duration-200 mb-2"
      >
        Retour
      </button>
    </div>
  );
};
