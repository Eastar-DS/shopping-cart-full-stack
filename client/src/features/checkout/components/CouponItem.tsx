import styled from "@emotion/styled";
import type { Coupon } from "../types";
import { colors } from "../../../shared/styles/tokens";
import { Stack } from "../../../shared/components/layout";
import { Checkbox } from "../../../shared/components/CheckBox";
import { formatYmd } from "../../../shared/utils/formatDate";

interface CouponItemProps {
  coupon: Coupon;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function CouponItem({
  coupon,
  checked,
  disabled = false,
  onToggle,
}: CouponItemProps) {
  return (
    <Item $disabled={disabled}>
      <Stack gap={8}>
        <Checkbox
          checked={checked}
          aria-disabled={disabled || undefined}
          onChange={() => {
            if (!disabled) onToggle();
          }}
          label={coupon.name}
        />
        <Stack gap={4}>
          <Detail>만료일: {formatYmd(coupon.expirationDate)}</Detail>
          {coupon.description && <Detail>{coupon.description}</Detail>}
        </Stack>
      </Stack>
    </Item>
  );
}

const Item = styled.div<{ $disabled: boolean }>`
  padding: 12px 0;
  border-top: 1px solid ${colors.divider};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
`;
const Detail = styled.span`
  font-size: 12px;
  color: ${colors.textPrimary};
  padding-left: 32px;
`;
