import styled from "@emotion/styled";
import { Suspense } from "react";
import { CartSkeleton } from "../../../shared/components/CartSkeleton";
import { ErrorBoundary } from "../../../shared/components/ErrorBoundary";
import { ErrorFallback } from "../../../shared/components/ErrorFallback";
import { queryStore } from "../../../shared/queries";
import { colors, fonts } from "../../../shared/styles/tokens";
import { CART_QUERY_KEY } from "../hooks/useCartQuery";
import { CartSection } from "./CartSection";

export function CartPage() {
  return (
    <Page>
      <PageTitle>장바구니</PageTitle>
      <ErrorBoundary
        fallback={ErrorFallback}
        onReset={() => queryStore.invalidate(CART_QUERY_KEY)}
      >
        <Suspense fallback={<CartSkeleton />}>
          <CartSection />
        </Suspense>
      </ErrorBoundary>
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
