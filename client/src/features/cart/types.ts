export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export type CartFetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; items: CartItem[] }
  | { status: "error"; message: string };
