const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const getToken = () => localStorage.getItem("bloomflash_token");
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}/api${path}`, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (response.status === 401 && path !== "/auth/signin" && path !== "/auth/signup") {
    localStorage.removeItem("bloomflash_token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("bloomflash:auth-expired"));
  }
  if (!response.ok) throw new Error(body.error || "Unable to complete your request.");
  return body as T;
}
export type Session = { token: string; user: { id: string; name: string; email: string } };
