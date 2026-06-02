import type { CartItem } from "../types";
import { apiRequest } from "../../../shared/api/httpClient";

export async function getCart(): Promise<CartItem[]> {
  return await apiRequest<CartItem[]>("/carts");
}
