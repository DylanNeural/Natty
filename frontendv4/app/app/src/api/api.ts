import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
const API_ENDPOINT = process.env.EXPO_PUBLIC_API_ENDPOINT || '/api';
const API_BASE = `${API_URL}${API_ENDPOINT}`;

export type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  targetWeight?: number;
  activityLevel?: string;
  goal?: string;
  dietaryPreferences?: string[];
};

export type AuthResponse = {
  message: string;
  user: User;
  token: string;
};

export type Meal = {
  id: string;
  mealId?: string | null;
  name: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  totalCalories?: number | null;
  date?: string;
  portionEaten?: number;
};

export type ProgressEntry = {
  _id?: string;
  id?: string;
  date?: string;
  weight?: number | null;
  bodyFat?: number | null;
  muscleMass?: number | null;
  waist?: number | null;
  chest?: number | null;
  notes?: string | null;
};

export type ChatbotMessageResponse = {
  ok: boolean;
  conversationId: string;
  reply: string;
  detectedIntent?: string;
  suggestions?: string[];
  disclaimer?: string;
};

export type ScanNutrition = {
  energie_kcal?: number;
  proteines_g?: number;
  glucides_g?: number;
  dont_sucres_g?: number;
  lipides_g?: number;
  dont_satures_g?: number;
  fibres_g?: number;
  sel_g?: number;
};

export type ScanData = {
  type?: string;
  nom?: string;
  marque?: string;
  description?: string;
  ingredients?: string[];
  allergenes?: string[];
  valeurs_nutritionnelles?: ScanNutrition;
  commentaires?: string;
};

export type ScanResponse = {
  ok: boolean;
  source: 'barcode' | 'image';
  data: ScanData;
};

type ApiErrorPayload = {
  message?: string;
  error?: {
    message?: string;
  };
};

export class ApiClient {
  private token: string | null = null;

  async init() {
    this.token = await AsyncStorage.getItem('natty.jwt');
  }

  private async getAuthHeader() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('natty.jwt');
    }
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  private async request<T = unknown>(
    endpoint: string,
    options: RequestInit & { method?: string } = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('X-Requested-With', 'XMLHttpRequest');

    const authHeader = await this.getAuthHeader();
    if (authHeader.Authorization) {
      headers.set('Authorization', authHeader.Authorization);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({} as ApiErrorPayload));
        const message = error.message || error.error?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }

      return (await response.json()) as T;
    } catch (err) {
      console.error(`[API] ${options.method || 'GET'} ${endpoint}:`, err);
      throw err;
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    captchaToken?: string
  ): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, captchaToken }),
    });

    if (data.token) {
      await AsyncStorage.setItem('natty.jwt', data.token);
      this.token = data.token;
    }

    return data;
  }

  async login(email: string, password: string, captchaToken?: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, captchaToken }),
    });

    if (data.token) {
      await AsyncStorage.setItem('natty.jwt', data.token);
      this.token = data.token;
    }

    return data;
  }

  async logout() {
    await AsyncStorage.removeItem('natty.jwt');
    this.token = null;
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/profile/me', { method: 'GET' });
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const data = await this.request<{ user: User }>('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.user;
  }

  async getMeals(): Promise<Meal[]> {
    const data = await this.request<{ meals: Meal[] }>('/meals', { method: 'GET' });
    return data.meals;
  }

  async createMeal(meal: Pick<Meal, 'name'> & Partial<Meal>): Promise<Meal> {
    const data = await this.request<{ meal: Meal }>('/meals', {
      method: 'POST',
      body: JSON.stringify(meal),
    });
    return data.meal;
  }

  async getJournalEntries(): Promise<import('../store/useJournalStore').JournalEntry[]> {
    const data = await this.request<{ entries: import('../store/useJournalStore').JournalEntry[] }>('/meals', { method: 'GET' });
    return data.entries;
  }

  async createJournalEntry(entry: Omit<import('../store/useJournalStore').JournalEntry, 'id'>): Promise<import('../store/useJournalStore').JournalEntry> {
    const data = await this.request<{ entry: import('../store/useJournalStore').JournalEntry }>('/meals', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    return data.entry;
  }

  async deleteJournalEntry(id: string): Promise<void> {
    await this.request(`/meals/${id}`, { method: 'DELETE' });
  }

  async getProgress(): Promise<ProgressEntry[]> {
    const data = await this.request<{ entries: ProgressEntry[] }>('/progress', { method: 'GET' });
    return data.entries;
  }

  async createProgress(entry: ProgressEntry): Promise<ProgressEntry> {
    const data = await this.request<{ entry: ProgressEntry }>('/progress', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    return data.entry;
  }

  async sendChatbotMessage(
    message: string,
    conversationId?: string,
    productContext?: unknown
  ): Promise<ChatbotMessageResponse> {
    return this.request<ChatbotMessageResponse>('/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId, productContext }),
    });
  }

  async getChatbotHistory() {
    return this.request('/chatbot/history', { method: 'GET' });
  }

  async resetChatbotConversation(): Promise<{ ok: boolean; conversationId: string }> {
    return this.request('/chatbot/reset', { method: 'POST' });
  }

  async scanImage(imageBase64: string, mimeType = 'image/jpeg'): Promise<ScanResponse> {
    return this.request<ScanResponse>('/scan', {
      method: 'POST',
      body: JSON.stringify({ imageBase64, mimeType }),
    });
  }

  async scanBarcode(barcode: string): Promise<ScanResponse> {
    return this.request<ScanResponse>('/scan', {
      method: 'POST',
      body: JSON.stringify({ barcode }),
    });
  }

  async getFridges(): Promise<import('../data/fridges').Fridge[]> {
    const data = await this.request<{ fridges: Array<{
      id: string; name: string; address: string; isOpen: boolean;
      stockCount: number; lat: number; lng: number;
    }> }>('/fridges', { method: 'GET' });
    return data.fridges.map((f) => ({
      id: String(f.id),
      name: f.name,
      addr: f.address,
      lat: f.lat,
      lng: f.lng,
      stockCount: f.stockCount,
      open: f.isOpen,
    }));
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await this.init();
      if (!this.token) return false;
      await this.getProfile();
      return true;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return this.token;
  }
}

export const apiClient = new ApiClient();
