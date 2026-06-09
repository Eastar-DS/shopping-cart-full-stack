import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { Checkbox } from "../../../shared/components/CheckBox";
import { colors } from "../../../shared/styles/tokens";
import { CartItemRow } from "../components/CartItemRow";
import { EmptyCart } from "../components/EmptyCart";
import { OrderSummary } from "../components/OrderSummary";
import { useCart } from "../hooks/useCart";
import { useCartQuery } from "../hooks/useCartQuery";
import {
  selectIsAllSelected,
  selectIsIndeterminate,
  selectShippingFee,
  selectSubtotal,
} from "../selectors";
import type { CheckoutState } from "../../checkout/types";

export function CartSection() {
  const items = useCartQuery();
  const { selectedIds, dispatch, updateItem, removeItem } = useCart(items);
  const navigate = useNavigate();

  if (items.length === 0) return <EmptyCart />;

  const isAllSelected = selectIsAllSelected(items, selectedIds);
  const isIndeterminate = selectIsIndeterminate(items, selectedIds);
  const subtotal = selectSubtotal(items, selectedIds);
  const shippingFee = selectShippingFee(items, selectedIds);

  const toggledId = (id: string) => dispatch({ type: "TOGGLE_ITEM", id });
  const toggleAll = () => {
    if (isAllSelected) dispatch({ type: "DESELECT_ALL" });
    else dispatch({ type: "SELECT_ALL", ids: items.map((i) => i.id) });
  };

  const handleProceed = () => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id));
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
        onChange={toggleAll}
        label="전체선택"
      />
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          isSelected={selectedIds.has(item.id)}
          onToggle={() => toggledId(item.id)}
          onUpdateQuantity={(next) => updateItem(item.id, next)}
          onRemove={() => removeItem(item.id)}
        />
      ))}
      <OrderSummary subtotal={subtotal} shippingFee={shippingFee} />
      <Button
        variant="primary"
        fullWidth
        onClick={handleProceed}
        disabled={selectedIds.size === 0}
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
