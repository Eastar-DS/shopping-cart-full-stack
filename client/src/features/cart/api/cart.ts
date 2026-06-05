import type { CartItem } from "../types";
import { apiRequest } from "../../../shared/api/httpClient";

export async function getCart(): Promise<CartItem[]> {
  return await apiRequest<CartItem[]>("/carts");
}

export function updateQuantity(
  id: string,
  quantity: number,
): Promise<void> {
  return apiRequest<void>(`/carts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}
