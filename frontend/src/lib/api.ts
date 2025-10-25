export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5050/api/v1';

let inMemoryToken: string | null = null;

export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  data?: any,
  requiresAuth: boolean = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth && inMemoryToken) {
    headers.Authorization = `Bearer ${inMemoryToken}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, options);
  
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const errorData = await res.json();
      message = errorData.message || message;
      if (errorData.hint) message += ` — ${errorData.hint}`;
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(message);
  }
  
  return (await res.json()) as T;
}

export function setAuthToken(token: string) {
  inMemoryToken = token;
}

export function clearAuthToken() {
  inMemoryToken = null;
}


