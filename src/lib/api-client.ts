/**
 * Cliente HTTP central da aplicação.
 *
 * Concentra baseURL, headers padrão e normalização de erro para que nenhuma
 * feature precise reimplementar lógica de request. A API é servida pelo MSW
 * (ver `src/mocks`), então a baseURL é relativa (`/api`).
 */

export const API_BASE_URL = '/api';

/** Erro normalizado de qualquer resposta HTTP com status >= 400. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await safeParseBody(response);
    const message =
      isRecord(body) && typeof body.message === 'string'
        ? body.message
        : `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, body);
  }

  // 204 No Content (ex.: DELETE) não tem corpo para parsear.
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function safeParseBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
