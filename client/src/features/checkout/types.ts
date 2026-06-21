import { z } from "../../shared/schema";

export interface CheckoutState {
  selectedItemIds: string[];
}

export const couponSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  expirationDate: z.string(),
});
export type Coupon = z.infer<typeof couponSchema>;

export const orderPreviewSchema = z.object({
  orderAmount: z.number(),
  couponDiscount: z.number(),
  deliveryFee: z.number(),
  totalPrice: z.number(),
  appliedCoupons: z.array(z.string()),
});
export type OrderPreview = z.infer<typeof orderPreviewSchema>;
