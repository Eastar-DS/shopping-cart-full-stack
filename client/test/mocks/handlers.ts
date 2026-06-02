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
      imageUrl: "/testURL1",
    },
    quantity: 1,
  },
  {
    id: "2",
    product: { id: "2", name: "PARADI", price: 1, imageUrl: "/testURL2" },
    quantity: 2,
  },
  {
    id: "3",
    product: { id: "5", name: "6month", price: 2, imageUrl: "/testURL5" },
    quantity: 98,
  },
];

export const handlers = [
  http.get(`${baseUrl}/carts`, () => {
    return HttpResponse.json(seedCart);
  }),
];
