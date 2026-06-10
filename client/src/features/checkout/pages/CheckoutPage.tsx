import styled from "@emotion/styled";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../../shared/components/Button";
import { colors } from "../../../shared/styles/tokens";
import type { CheckoutState } from "../types";

export function CheckoutPage() {
  const { state } = useLocation() as { state: CheckoutState | null };
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { kindsCount, totalQuantity, total } = state;

  return (
    <Page>
      <Title>주문 확인</Title>

      <Description>
        총 {kindsCount}종류의 상품 {totalQuantity}개를 주문합니다.
        <br />
        최종 결제 금액을 확인해 주세요.
      </Description>

      <TotalSection>
        <TotalLabel>총 결제 금액</TotalLabel>
        <TotalAmount>{total.toLocaleString()}원</TotalAmount>
      </TotalSection>

      <Button variant="primary" fullWidth disabled>
        결제하기
      </Button>
    </Page>
  );
}

const Page = styled.section`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: calc(100vh - 64px);
  background: ${colors.background};
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: ${colors.textPrimary};
  text-align: center;
  margin: 0 0 16px;
`;

const Description = styled.p`
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.textPrimary};
  margin: 0 0 32px;
  line-height: 1.5;
`;

const TotalSection = styled.section`
  padding-top: 16px;
  border-top: 1px solid ${colors.divider};
  text-align: center;
  margin-bottom: 24px;
`;

const TotalLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 8px;
`;

const TotalAmount = styled.div`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;
