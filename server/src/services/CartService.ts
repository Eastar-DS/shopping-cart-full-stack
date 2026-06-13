import { cartItems, products } from "../db.js";
import { InvalidInputError, NotFoundError } from "../errors/HttpError.js";
import type { CartItem } from "../models/CartItem.js";
import type { UpdateCartQuantityRequestBody } from "../type.js";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

const isValidQuantity = (quantity: unknown) => {
  return (
    typeof quantity === "number" &&
    Number.isInteger(quantity) &&
    quantity >= MIN_QUANTITY &&
    quantity <= MAX_QUANTITY
  );
};

const isUpdateCartQuantityRequestBody = (
  body: unknown,
): body is UpdateCartQuantityRequestBody => {
  return typeof body === "object" && body !== null;
};

const isValidUpdateCartQuantityBody = (
  body: unknown,
): body is UpdateCartQuantityRequestBody => {
  if (!isUpdateCartQuantityRequestBody(body)) {
    return false;
  }

  return isValidQuantity(body.quantity);
};

const toCartItemResponse = (cartItem: CartItem) => {
  const product = products.findById(cartItem.productId);

  if (!product) {
    throw new NotFoundError();
  }

  return {
    id: cartItem.id,
    product,
    quantity: cartItem.getQuantity(),
  };
};

export const cartService = {
  getCartItems() {
    return cartItems.findAll().map(toCartItemResponse);
  },

  updateQuantity(id: string, body: unknown) {
    if (!isValidUpdateCartQuantityBody(body)) {
      throw new InvalidInputError();
    }

    const updatedCartItem = cartItems.updateQuantity(id, body.quantity);

    if (!updatedCartItem) {
      throw new NotFoundError();
    }

    return toCartItemResponse(updatedCartItem);
  },

  deleteCartItem(id: string): void {
    const isDeleted = cartItems.deleteById(id);

    if (!isDeleted) {
      throw new NotFoundError();
    }
  },
};
