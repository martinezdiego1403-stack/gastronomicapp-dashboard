const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app-gastronomico-production.up.railway.app/api';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private headers(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, { headers: this.headers() });
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('No autorizado');
    }
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Error desconocido' }));
      throw new Error(error.error || `Error ${res.status}`);
    }
    return res.json();
  }
}

export const api = new ApiClient();
