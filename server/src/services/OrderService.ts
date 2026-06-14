import { InvalidInputError, NotFoundError } from "../errors/HttpError.js";
import type { CartItemRepository } from "../repositories/CartItemRepository.js";
import type { CouponRepository } from "../repositories/CouponRepository.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";
import { calculateOrder } from "./order/calculateOrder.js";
import type { OrderLineItem } from "./order/couponPolicy.js";

const MAX_COUPONS_MANUAL = 2;

export type OrderPreviewMode = "auto" | "manual";

interface ParsedOrderPreview {
  selectedItemIds: string[];
  coupons: string[];
  isRemoteArea: boolean;
}

const isStringOrNumber = (value: unknown): value is string | number =>
  typeof value === "string" || typeof value === "number";

const isIdArray = (value: unknown): value is Array<string | number> =>
  Array.isArray(value) && value.every(isStringOrNumber);

const toStringIds = (ids: Array<string | number>): string[] => ids.map((id) => `${id}`);

const parseRequest = (body: unknown, mode: OrderPreviewMode): ParsedOrderPreview => {
  if (typeof body !== "object" || body === null) {
    throw new InvalidInputError();
  }

  const { selectedItemIds, coupons, isRemoteArea } = body as Record<string, unknown>;

  // 선택 상품은 1개 이상이어야 한다
  if (!isIdArray(selectedItemIds) || selectedItemIds.length === 0) {
    throw new InvalidInputError();
  }

  if (!isIdArray(coupons)) {
    throw new InvalidInputError();
  }

  if (typeof isRemoteArea !== "boolean") {
    throw new InvalidInputError();
  }

  // manual 모드에서는 최대 2개까지만 허용 (auto 모드는 최적 조합 자동 선택을 위해 제한 없음)
  if (mode === "manual" && coupons.length > MAX_COUPONS_MANUAL) {
    throw new InvalidInputError();
  }

  return {
    selectedItemIds: toStringIds(selectedItemIds),
    coupons: toStringIds(coupons),
    isRemoteArea,
  };
};

export interface OrderServiceDeps {
  cartItemRepository: CartItemRepository;
  productRepository: ProductRepository;
  couponRepository: CouponRepository;
}

export const createOrderService = ({
  cartItemRepository,
  productRepository,
  couponRepository,
}: OrderServiceDeps) => ({
  async previewOrder(body: unknown, options: { mode: OrderPreviewMode }) {
    const { selectedItemIds, coupons, isRemoteArea } = parseRequest(body, options.mode);

    const allCartItems = await cartItemRepository.findAll();
    const cartItemById = new Map(allCartItems.map((cartItem) => [cartItem.id, cartItem]));

    const selectedCartItems = selectedItemIds.map((id) => {
      const cartItem = cartItemById.get(id);
      if (!cartItem) {
        throw new NotFoundError();
      }
      return cartItem;
    });

    const allProducts = await productRepository.findAll();
    const productById = new Map(allProducts.map((product) => [product.id, product]));

    const items: OrderLineItem[] = selectedCartItems.map((cartItem) => {
      const product = productById.get(cartItem.productId);
      if (!product) {
        throw new NotFoundError();
      }
      return {
        productId: cartItem.productId,
        price: product.price,
        quantity: cartItem.getQuantity(),
      };
    });

    const allCoupons = await couponRepository.findAll();
    const couponById = new Map(allCoupons.map((coupon) => [coupon.id, coupon]));

    const candidateCoupons = coupons.map((id) => {
      const coupon = couponById.get(id);
      if (!coupon) {
        throw new NotFoundError();
      }
      return coupon;
    });

    return calculateOrder({
      items,
      candidateCoupons,
      isRemoteArea,
      now: new Date(),
    });
  },
});

export type OrderService = ReturnType<typeof createOrderService>;
