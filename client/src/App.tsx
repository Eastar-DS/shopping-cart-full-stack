import styled from "@emotion/styled";
import { colors, fonts } from "./shared/styles/tokens";
import { GlobalStyles } from "./shared/styles/GlobalStyles";
import { CartItemRow } from "./features/cart/components/CartItemRow";
import { OrderSummary } from "./features/cart/components/OrderSummary";

import { useCart } from "./features/cart/hooks/useCart";
import type { CartItem } from "./features/cart/types";
import {
  selectIsAllSelected,
  selectIsIndeterminate,
  selectShippingFee,
  selectSubtotal,
} from "./features/cart/selectors";
import { CheckIcon } from "./assets/icons/CheckIcon";

function App() {
  const { cartFetch, selectedIds, dispatch } = useCart();

  const items: CartItem[] =
    cartFetch.status === "success" ? cartFetch.items : [];

  const isAllSelected = selectIsAllSelected(items, selectedIds);
  const isIndeterminate = selectIsIndeterminate(items, selectedIds);

  const subtotal = selectSubtotal(items, selectedIds);

  const shippingFee = selectShippingFee(items, selectedIds);

  const toggledId = (id: string) => {
    dispatch({ type: "TOGGLE_ITEM", id: id });
  };

  const toggleAll = () => {
    if (isAllSelected) {
      dispatch({ type: "DESELECT_ALL" });
    } else {
      dispatch({ type: "SELECT_ALL", ids: items.map((item) => item.id) });
    }
  };

  const cartContent = (() => {
    switch (cartFetch.status) {
      case "success":
        return (
          <>
            <CheckboxLabel>
              <HiddenCheckbox
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleAll}
              />
              <CheckboxBox $checked={isAllSelected}>
                <CheckIcon
                  color={isAllSelected ? "#fff" : "rgba(0, 0, 0, 0.1)"}
                />
              </CheckboxBox>
              <span>전체선택</span>
            </CheckboxLabel>

            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                isSelected={selectedIds.has(item.id)}
                onToggle={() => toggledId(item.id)}
              />
            ))}
            <OrderSummary subtotal={subtotal} shippingFee={shippingFee} />
          </>
        );

      case "loading":
        return <p>로딩중</p>;
      case "error":
        return <p>{cartFetch.message}</p>;
      case "idle":
        return null;
    }
  })();
  return (
    <>
      <GlobalStyles />
      <Page>
        <PageTitle>장바구니</PageTitle>
        {cartFetch.status === "success" && cartFetch.items.length > 0 && (
          <Subtitle>
            현재 {cartFetch.items.length}종류의 상품이 담겨있습니다.
          </Subtitle>
        )}
        {cartContent}
      </Page>
    </>
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

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const CheckboxBox = styled.span<{ $checked: boolean }>`
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: ${({ $checked }) => ($checked ? "#000" : "#fff")};
  border: 1px solid
    ${({ $checked }) => ($checked ? "#000" : "rgba(0, 0, 0, 0.1)")};
  transition: all 0.15s;
`;

export default App;
