import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../../../shared/styles/tokens";
import { CartItemRow } from "../components/CartItemRow";
import { EmptyCart } from "../components/EmptyCart";
import { OrderSummary } from "../components/OrderSummary";
import { useCart } from "../hooks/useCart";
import type { CartItem } from "../types";
import {
  selectIsAllSelected,
  selectIsIndeterminate,
  selectShippingFee,
  selectSubtotal,
} from "../selectors";
import { Checkbox } from "../../../shared/components/CheckBox";
import { Button } from "../../../shared/components/Button";
import type { CheckoutState } from "../../checkout/types";

export function CartPage() {
  const { cartFetch, selectedIds, dispatch, updateItem, removeItem, refetch } =
    useCart();
  const navigate = useNavigate();

  const items: CartItem[] =
    cartFetch.status === "success" ? cartFetch.items : [];

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

  const cartContent = (() => {
    switch (cartFetch.status) {
      case "success":
        if (items.length === 0) return <EmptyCart />;
        return (
          <>
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
      case "loading":
        return <LoadingText role="status">로딩중</LoadingText>;
      case "error":
        return (
          <ErrorBox role="alert">
            <ErrorText>{cartFetch.message}</ErrorText>
            <Button variant="primary" onClick={() => refetch()}>
              다시 시도
            </Button>
          </ErrorBox>
        );
      case "idle":
        return null;
    }
  })();

  return (
    <Page>
      <PageTitle>장바구니</PageTitle>
      {cartFetch.status === "success" && cartFetch.items.length > 0 && (
        <Subtitle>
          현재 {cartFetch.items.length}종류의 상품이 담겨있습니다.
        </Subtitle>
      )}
      {cartContent}
    </Page>
  );
}

const Page = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
  background: ${colors.background};
  min-height: 100vh;
`;

const PageTitle = styled.h1`
  font-family: ${fonts.pageTitle.fontFamily};
  font-weight: ${fonts.pageTitle.fontWeight};
  font-size: ${fonts.pageTitle.fontSize};
  color: ${colors.textPrimary};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.textPrimary};
  margin: 8px 0 16px;
`;

const LoadingText = styled.p`
  padding: 64px 24px;
  text-align: center;
  color: ${colors.textPrimary};
  margin: 0;
`;

const ErrorBox = styled.div`
  padding: 64px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ErrorText = styled.p`
  color: ${colors.textPrimary};
  margin: 0;
`;
