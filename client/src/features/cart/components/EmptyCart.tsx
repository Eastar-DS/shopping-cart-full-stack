import styled from "@emotion/styled";
import { colors } from "../../../shared/styles/tokens";

export function EmptyCart() {
  return (
    <Container role="status" aria-live="polite">
      <Message>장바구니에 담은 상품이 없습니다.</Message>
    </Container>
  );
}

const Container = styled.div`
  padding: 80px 24px;
  text-align: center;
`;

const Message = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.textPrimary};
  margin: 0;
`;
