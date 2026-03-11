import React, { useMemo, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  onBack: () => void;
}

type TestStatus = "ok" | "warn" | "error";

type TestItem = {
  name: string;
  status: TestStatus;
  summary: string;
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

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

const API_URL = normalizeApiBaseUrl((import.meta as any).env?.VITE_API_URL as string | undefined);
const RECAPTCHA_SITE_KEY = ((import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY as string | undefined) || "";

export const TestScreen: React.FC<Props> = ({ onBack }) => {
  const [running, setRunning] = useState(false);
  const [runningRealLogin, setRunningRealLogin] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<TestItem[]>([]);
  const [testEmail, setTestEmail] = useState(DEFAULT_TEST_EMAIL);
  const [testPassword, setTestPassword] = useState(DEFAULT_TEST_PASSWORD);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const logsText = useMemo(() => logs.join("\n"), [logs]);

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
      "access-control-allow-origin": res.headers.get("access-control-allow-origin") || "(absent)",
      "access-control-allow-credentials": res.headers.get("access-control-allow-credentials") || "(absent)",
      "set-cookie": res.headers.get("set-cookie") || "(non lisible depuis navigateur)",
      "content-type": res.headers.get("content-type") || "(absent)",
    };
  };

  const runRequest = async (
    name: string,
    path: string,
    init: RequestInit = {},
    evaluator?: (res: Response, body: unknown) => { status: TestStatus; summary: string }
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
      appendLog(`RES body=${typeof parsedBody === "string" ? parsedBody.slice(0, 800) : JSON.stringify(parsedBody).slice(0, 800)}`);

      if (evaluator) {
        const { status, summary } = evaluator(res, parsedBody);
        pushResult(name, status, summary);
      } else {
        pushResult(name, res.ok ? "ok" : "warn", res.ok ? "Réponse OK" : `HTTP ${res.status}`);
      }

      return { res, body: parsedBody };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      appendLog(`RES network-error=${message}`);
      pushResult(name, "error", "Erreur réseau/CORS (requête bloquée ou backend inaccessible)");
      return null;
    }
  };

  const runAllTests = async () => {
    setRunning(true);
    setLogs([]);
    setResults([]);

    appendLog("Démarrage des diagnostics frontend -> backend");
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
        const token = typeof body === "object" && body ? (body as { csrfToken?: string }).csrfToken : undefined;
        if (!res.ok) {
          return { status: "error", summary: `Échec récupération CSRF (${res.status})` };
        }
        if (!token) {
          return { status: "error", summary: "Pas de csrfToken dans la réponse" };
        }
        return { status: "ok", summary: "csrfToken récupéré" };
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
        const text = typeof body === "string" ? body : JSON.stringify(body || {});
        if (res.status === 403 && text.toLowerCase().includes("csrf")) {
          return { status: "error", summary: "CSRF rejeté (cookie/header manquant)" };
        }
        if (res.status === 403 && text.toLowerCase().includes("captcha")) {
          return { status: "ok", summary: "Route auth OK (captcha bloque normalement)" };
        }
        if (res.status >= 500) {
          return { status: "error", summary: `Erreur serveur (${res.status}) sur auth/register` };
        }
        if (res.ok) {
          return { status: "ok", summary: "Register fonctionne" };
        }
        return { status: "warn", summary: `Réponse inattendue (${res.status})` };
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
        const text = typeof body === "string" ? body : JSON.stringify(body || {});
        if (res.status === 403 && text.toLowerCase().includes("csrf")) {
          return { status: "error", summary: "CSRF rejeté sur login" };
        }
        if (res.status === 403 && text.toLowerCase().includes("captcha")) {
          return { status: "ok", summary: "Route login OK (captcha bloque normalement)" };
        }
        if (res.status >= 500) {
          return { status: "error", summary: `Erreur serveur (${res.status}) sur auth/login` };
        }
        if (res.status === 401) {
          return { status: "ok", summary: "Route login répond (identifiants invalides attendus)" };
        }
        return { status: "warn", summary: `Réponse inattendue (${res.status})` };
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
          return { status: "ok", summary: "Route profile joignable (auth rejetée normalement)" };
        }
        if (res.status >= 500) {
          return { status: "error", summary: `Erreur serveur (${res.status}) sur profile` };
        }
        return { status: "warn", summary: `Réponse inattendue (${res.status})` };
      }
    );

    appendLog("\nDiagnostics terminés");
    setRunning(false);
  };

  const runRealLoginTest = async () => {
    if (!testEmail.trim() || !testPassword) {
      pushResult("Login réel (Dylan)", "error", "Email/mot de passe manquant");
      appendLog("Login réel annulé: email ou mot de passe manquant");
      return;
    }

    if (!captchaToken) {
      pushResult("Login réel (Dylan)", "error", "Captcha requis avant test login réel");
      appendLog("Login réel annulé: captchaToken manquant");
      return;
    }

    setRunningRealLogin(true);

    const csrfResponse = await runRequest(
      "CSRF token (login réel)",
      "/api/csrf-token",
      { method: "GET", credentials: "include" },
      (res, body) => {
        const token = typeof body === "object" && body ? (body as { csrfToken?: string }).csrfToken : undefined;
        if (!res.ok || !token) {
          return { status: "error", summary: "Impossible de récupérer CSRF pour login réel" };
        }
        return { status: "ok", summary: "CSRF OK pour login réel" };
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
      "Login réel (Dylan)",
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
          captchaToken,
        }),
      },
      (res, body) => {
        const text = typeof body === "string" ? body : JSON.stringify(body || {});
        if (res.ok && typeof body === "object" && body && (body as { token?: string }).token) {
          return { status: "ok", summary: "Connexion réelle OK (token reçu)" };
        }
        if (res.status === 403 && text.toLowerCase().includes("captcha")) {
          return { status: "error", summary: "Captcha invalide/expiré (regénère le captcha)" };
        }
        if (res.status === 403 && text.toLowerCase().includes("csrf")) {
          return { status: "error", summary: "CSRF rejeté sur login réel" };
        }
        if (res.status === 401) {
          return { status: "error", summary: "Identifiants invalides" };
        }
        if (res.status >= 500) {
          return { status: "error", summary: `Erreur serveur (${res.status}) sur login réel` };
        }
        return { status: "warn", summary: `Réponse inattendue (${res.status})` };
      }
    );

    setRunningRealLogin(false);
  };

  const copyLogs = async () => {
    if (!logsText) return;
    try {
      await navigator.clipboard.writeText(logsText);
      appendLog("Logs copiés dans le presse-papiers");
    } catch {
      appendLog("Impossible de copier automatiquement, copie manuelle depuis la zone de logs");
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 bg-background-light dark:bg-background-dark overflow-y-auto">
      <div className="text-center mt-2">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">Diagnostics backend</h1>
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
        <h2 className="text-sm font-bold text-text-light dark:text-text-dark">Test connexion réelle</h2>
        <p className="mt-1 text-xs text-text-light/70 dark:text-text-dark/70">
          Vérifie la vraie connexion avec tes identifiants (captcha requis).
        </p>

        <div className="mt-3 grid gap-2">
          <input
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-text-light dark:text-text-dark"
            placeholder="Email"
            type="email"
            disabled={running || runningRealLogin}
          />
          <input
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-text-light dark:text-text-dark"
            placeholder="Mot de passe"
            type="password"
            disabled={running || runningRealLogin}
          />

          {RECAPTCHA_SITE_KEY ? (
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken(null)}
            />
          ) : (
            <p className="text-xs text-red-500">VITE_RECAPTCHA_SITE_KEY manquant: test login réel impossible.</p>
          )}

          <button
            onClick={runRealLoginTest}
            disabled={running || runningRealLogin || !RECAPTCHA_SITE_KEY}
            className="rounded-xl px-4 py-2 bg-primary text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {runningRealLogin ? "Test login en cours..." : "Tester connexion réelle"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-white dark:bg-card-dark ring-1 ring-gray-200 dark:ring-gray-800">
        <h2 className="text-sm font-bold text-text-light dark:text-text-dark">Résultats</h2>
        {results.length === 0 ? (
          <p className="mt-2 text-xs text-text-light/70 dark:text-text-dark/70">Aucun test lancé.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {results.map((result, index) => (
              <li key={`${result.name}-${index}`} className="text-sm text-text-light dark:text-text-dark">
                <span className={`font-bold ${statusClasses[result.status]}`}>[{result.status.toUpperCase()}]</span>{" "}
                {result.name} — {result.summary}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl p-4 bg-white dark:bg-card-dark ring-1 ring-gray-200 dark:ring-gray-800 flex-1 min-h-[260px]">
        <h2 className="text-sm font-bold text-text-light dark:text-text-dark">Logs détaillés</h2>
        <textarea
          value={logsText}
          readOnly
          className="mt-2 w-full min-h-[220px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-xs text-text-light dark:text-text-dark"
          placeholder="Les logs apparaîtront ici..."
        />
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
