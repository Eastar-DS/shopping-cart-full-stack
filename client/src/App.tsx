import styled from "@emotion/styled";
import { colors, fonts } from "./shared/styles/tokens";
import { GlobalStyles } from "./shared/styles/GlobalStyles";
import { CartItemRow } from "./features/cart/components/CartItemRow";
import { OrderSummary } from "./features/cart/components/OrderSummary";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
} from "./features/cart/constants";
import { useCart } from "./features/cart/hooks/useCart";
import type { CartItem } from "./features/cart/types";

function App() {
  const { cartFetch, selectedIds, dispatch } = useCart();

  const items: CartItem[] =
    cartFetch.status === "success" ? cartFetch.items : [];

  const isAllSelected = items.length > 0 && items.length === selectedIds.size;
  const isIndeterminate = selectedIds.size > 0 && !isAllSelected;

  const subtotal = items
    .filter((item) => selectedIds.has(item.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

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
            <label>
              <input
                type="checkbox"
                checked={isAllSelected}
                aria-checked={isIndeterminate ? "mixed" : isAllSelected}
                onChange={toggleAll}
              />
              전체선택
            </label>
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

export default App;
