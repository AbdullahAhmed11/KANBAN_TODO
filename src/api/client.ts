const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (err) {
    const isNetworkError =
      err instanceof TypeError && (err.message === 'Failed to fetch' || err.message.includes('fetch'));
    throw new Error(
      isNetworkError
        ? `Cannot connect to the API at ${BASE_URL}. Start the server with: npm run server`
        : (err instanceof Error ? err.message : 'Network error')
    );
  }
  if (!res.ok) {
    const message = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(message.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
