import styled from "@emotion/styled";
import { colors } from "../../../shared/styles/tokens";
import infoIcon from "../../../assets/icons/info-outline.svg";
import { FREE_SHIPPING_THRESHOLD } from "../constants";

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
}

export function OrderSummary({ subtotal, shippingFee }: OrderSummaryProps) {
  const total = subtotal + shippingFee;
  return (
    <>
      <Hint>
        <img src={infoIcon} alt="" width={16} height={16} />총 주문 금액이{" "}
        {FREE_SHIPPING_THRESHOLD.toLocaleString()}원 이상일 경우 무료
        배송됩니다.
      </Hint>
      <Section>
        <SummaryRow>
          <span>주문 금액</span>
          <span>{subtotal.toLocaleString()}원</span>
        </SummaryRow>
        <SummaryRow>
          <span>배송비</span>
          <span>{shippingFee.toLocaleString()}원</span>
        </SummaryRow>
      </Section>

      <Section>
        <SummaryRow>
          <span>총 결제 금액</span>
          <span>{total.toLocaleString()}원</span>
        </SummaryRow>
      </Section>
    </>
  );
}

const Section = styled.section`
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

const Hint = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 16px 0;
  font-size: 12px;
  color: ${colors.textPrimary};
  opacity: 0.6;
`;
