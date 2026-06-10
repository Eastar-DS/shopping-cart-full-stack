import type { CartItem } from "../types";
import { apiRequest } from "../../../shared/api/httpClient";

export async function getCart(): Promise<CartItem[]> {
  return await apiRequest<CartItem[]>("/carts");
}

export function updateQuantity(
  id: string,
  quantity: number,
): Promise<CartItem> {
  return apiRequest<CartItem>(`/carts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(id: string): Promise<void> {
  return apiRequest<void>(`/carts/${id}`, {
    method: "DELETE",
  });
}
