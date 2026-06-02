export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiError";
  }
}

import { API_BASE_URL } from "./env";

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      typeof body.error === "string" ? body.error : "UnknownError",
      typeof body.message === "string"
        ? body.message
        : `HTTP ${response.status}`,
    );
  }

  if (response.status === 204) return null as T;
  return await response.json();
}
