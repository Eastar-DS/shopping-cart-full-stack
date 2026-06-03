import styled from "@emotion/styled";
import { colors, fonts } from "./shared/styles/tokens";
import { GlobalStyles } from "./shared/styles/GlobalStyles";
import { useEffect, useState } from "react";
import type { CartFetchState, CartItem } from "./features/cart/types";
import { getCart } from "./features/cart/api/cart";
import { toUserMessage } from "./shared/api/errorMessages";
import { CartItemRow } from "./features/cart/components/CartItemRow";
import infoIcon from "./assets/icons/info-outline.svg";

const FREE_SHIPPING_THRESHOLD = 100_000;
const SHIPPING_FEE = 3_000;

function App() {
  const [cartFetch, setCartFetch] = useState<CartFetchState>({
    status: "idle",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const items: CartItem[] =
    cartFetch.status === "success" ? cartFetch.items : [];

  const isAllSelected = items.length > 0 && items.length === selectedIds.size;
  const isIndeterminate = selectedIds.size > 0 && !isAllSelected;

  const subtotal = items
    .filter((item) => selectedIds.has(item.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const toggledId = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      setCartFetch({ status: "loading" });
      try {
        const data: CartItem[] = await getCart();
        setCartFetch({ status: "success", items: data });
      } catch (e) {
        const message = toUserMessage(e);
        setCartFetch({ status: "error", message: message });
      }
    };
    fetchCartItems();
  }, []);

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
            <Hint>
              <img src={infoIcon} alt="" width={16} height={16} />총 주문 금액이{" "}
              {FREE_SHIPPING_THRESHOLD}원 이상일 경우 무료 배송됩니다.
            </Hint>
            <OrderSummary>
              <SummaryRow>
                <span>주문 금액</span>
                <span>{subtotal.toLocaleString()}원</span>
              </SummaryRow>
              <SummaryRow>
                <span>배송비</span>
                <span>{shippingFee.toLocaleString()}원</span>
              </SummaryRow>
            </OrderSummary>

            <OrderSummary>
              <SummaryRow>
                <span>총 결제 금액</span>
                <span>{total.toLocaleString()}원</span>
              </SummaryRow>
            </OrderSummary>
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

const Hint = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 16px 0;
  font-size: 12px;
  color: ${colors.textPrimary};
  opacity: 0.6;
`;

const OrderSummary = styled.section`
  padding-top: 16px;
  border-top: 1px solid ${colors.divider};

  & + & {
    margin-top: 16px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export default App;
