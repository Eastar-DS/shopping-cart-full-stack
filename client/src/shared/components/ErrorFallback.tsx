import styled from "@emotion/styled";
import { toUserMessage } from "../api/errorMessages";
import { colors } from "../styles/tokens";
import { Button } from "./Button";
import type { ErrorFallbackProps } from "./ErrorBoundary";

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <Container role="alert">
      <Message>{toUserMessage(error)}</Message>
      <Button variant="primary" onClick={reset}>
        다시 시도
      </Button>
    </Container>
  );
}

const Container = styled.div`
  padding: 64px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Message = styled.p`
  color: ${colors.textPrimary};
  margin: 0;
`;
