import type { CouponRepository } from "../repositories/CouponRepository.js";

export interface CouponServiceDeps {
  couponRepository: CouponRepository;
}

export const createCouponService = ({
  couponRepository,
}: CouponServiceDeps) => ({
  async getCoupons() {
    return couponRepository.findAll();
  },
});

export type CouponService = ReturnType<typeof createCouponService>;
