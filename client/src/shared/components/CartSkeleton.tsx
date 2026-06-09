import styled from "@emotion/styled";
import { colors } from "../styles/tokens";

export function CartSkeleton() {
  return (
    <Container role="status" aria-live="polite" aria-busy="true">
      <SkeletonBar />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <span className="visually-hidden">장바구니 불러오는 중</span>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 400px;
  padding-top: 16px;
`;

const shimmer = `
  background: linear-gradient(
    90deg,
    ${colors.divider} 0%,
    rgba(0, 0, 0, 0.05) 50%,
    ${colors.divider} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s linear infinite;
  border-radius: 4px;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonBar = styled.div`
  ${shimmer}
  height: 24px;
  width: 40%;
`;

const SkeletonRow = styled.div`
  ${shimmer}
  height: 96px;
  width: 100%;
`;
