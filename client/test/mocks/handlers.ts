import { http, HttpResponse } from "msw";
import type { CartItem } from "./../../src/features/cart/types";
const baseUrl = "http://localhost:3000";

const seedCart: CartItem[] = [
  {
    id: "1",
    product: {
      id: "1",
      name: "EASTER",
      price: 100000000000,
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    },
    quantity: 1,
  },
  {
    id: "2",
    product: {
      id: "2",
      name: "PARADI",
      price: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop",
    },
    quantity: 2,
  },
  {
    id: "3",
    product: {
      id: "5",
      name: "6month",
      price: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=200&h=200&fit=crop",
    },
    quantity: 98,
  },
];

export const handlers = [
  http.get(`${baseUrl}/carts`, () => {
    return HttpResponse.json(seedCart);
  }),
];
