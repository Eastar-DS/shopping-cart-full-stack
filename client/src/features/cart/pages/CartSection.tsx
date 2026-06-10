import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Checkbox } from "../../../shared/components/CheckBox";
import { colors } from "../../../shared/styles/tokens";
import { CartItemRow } from "../components/CartItemRow";
import { EmptyCart } from "../components/EmptyCart";
import { OrderSummary } from "../components/OrderSummary";
import { useCartDeleteMutation } from "../hooks/useCartDeleteMutation";
import { useCartQuery } from "../hooks/useCartQuery";
import { useCartUpdateMutation } from "../hooks/useCartUpdateMutation";
import { useCheckedItems } from "../hooks/useCheckedItems";
import {
  selectIsAllSelected,
  selectIsIndeterminate,
  selectShippingFee,
  selectSubtotal,
} from "../selectors";
import type { CheckoutState } from "../../checkout/types";

export function CartSection() {
  const items = useCartQuery();
  const { ids, toggle, selectAll, deselectAll } = useCheckedItems(items);
  const { mutate: updateMutate } = useCartUpdateMutation();
  const { mutate: deleteMutate } = useCartDeleteMutation();
  const navigate = useNavigate();

  if (items.length === 0) return <EmptyCart />;

  const isAllSelected = selectIsAllSelected(items, ids);
  const isIndeterminate = selectIsIndeterminate(items, ids);
  const subtotal = selectSubtotal(items, ids);
  const shippingFee = selectShippingFee(items, ids);

  const handleProceed = () => {
    const selectedItems = items.filter((item) => ids.has(item.id));
    const total = subtotal + shippingFee;
    const state: CheckoutState = {
      kindsCount: selectedItems.length,
      totalQuantity: selectedItems.reduce((sum, item) => sum + item.quantity, 0),
      total,
    };
    navigate("/checkout", { state });
  };

  return (
    <>
      <Subtitle>현재 {items.length}종류의 상품이 담겨있습니다.</Subtitle>
      <Checkbox
        checked={isAllSelected}
        indeterminate={isIndeterminate}
        onChange={isAllSelected ? deselectAll : selectAll}
        label="전체선택"
      />
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          isSelected={ids.has(item.id)}
          onToggle={() => toggle(item.id)}
          onUpdateQuantity={(next) =>
            updateMutate({ id: item.id, quantity: next })
          }
          onRemove={() => deleteMutate(item.id)}
        />
      ))}
      <OrderSummary subtotal={subtotal} shippingFee={shippingFee} />
      <Button
        variant="primary"
        fullWidth
        onClick={handleProceed}
        disabled={ids.size === 0}
      >
        주문 확인
      </Button>
    </>
  );
}

const Subtitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.textPrimary};
  margin: 8px 0 16px;
`;
