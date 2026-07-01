export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ApiError extends Error {
  status: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    // fetch só rejeita em falha de rede / servidor fora do ar (não em status HTTP)
    const err = new Error('Não foi possível conectar ao servidor') as ApiError;
    err.status = 0;
    throw err;
  }

  if (res.status === 401) {
    const err = new Error('Não autorizado') as ApiError;
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    let message = text;
    try {
      message = (JSON.parse(text) as { message?: string }).message ?? text;
    } catch { /* keep raw text */ }
    const err = new Error(message) as ApiError;
    err.status = res.status;
    throw err;
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get:    <T>(path: string)                    => request<T>(path),
  post:   <T>(path: string, body?: unknown)    => request<T>(path, { method: 'POST',  body: JSON.stringify(body) }),
  patch:  <T>(path: string, body?: unknown)    => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put:    <T>(path: string, body?: unknown)    => request<T>(path, { method: 'PUT',   body: JSON.stringify(body) }),
  delete: <T>(path: string)                    => request<T>(path, { method: 'DELETE' }),
};
