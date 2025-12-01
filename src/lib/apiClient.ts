//connecting to FastAPI backend//
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // 204 No Content => no body
  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body?.detail) {
        message = Array.isArray(body.detail)
          ? body.detail.map((d: any) => d.msg ?? JSON.stringify(d)).join("; ")
          : body.detail;
      }
    } catch {
      // ignore JSON parse errors, keep statusText
    }
    throw new Error(`API error ${res.status}: ${message}`);
  }

  return (await res.json()) as T;
}
