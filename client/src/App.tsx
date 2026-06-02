import styled from "@emotion/styled";
import { colors, fonts } from "./shared/styles/tokens";
import { GlobalStyles } from "./shared/styles/GlobalStyles";
import { useEffect, useState } from "react";
import type { CartFetchState, CartItem } from "./features/cart/types";
import { getCart } from "./features/cart/api/cart";
import { toUserMessage } from "./shared/api/errorMessages";

function App() {
  // const [items, setItems] = useState<CartItem[]>([]);
  const [cartFetch, setCartFetch] = useState<CartFetchState>({
    status: "idle",
  });

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
            {cartFetch.items.map((item) => {
              return (
                <CartItemRow key={item.id}>
                  <div>{item.product.name}</div>
                  <div>{item.product.price.toLocaleString()} 원</div>
                  <div>{item.quantity}</div>
                  <button>삭제</button>
                </CartItemRow>
              );
            })}
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

const CartItemRow = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid ${colors.divider};
`;

export default App;
