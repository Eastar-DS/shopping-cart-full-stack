import type { ReactNode } from "react";
import type { Product } from "../types";
import { Row, Stack } from "../../../shared/components/layout";
import styled from "@emotion/styled";
import { colors } from "../../../shared/styles/tokens";

interface CartItemContentProps {
  product: Product;
  children?: ReactNode;
}

export function CartItemContent({ product, children }: CartItemContentProps) {
  return (
    <Row gap={24}>
      <ProductImage src={product.imageUrl} alt={product.name} />
      <Stack gap={4} flex={1}>
        <ProductName>{product.name}</ProductName>
        <Price>{product.price.toLocaleString()}원</Price>
        {children}
      </Stack>
    </Row>
  );
}
const ProductImage = styled.img`
  width: 112px;
  height: 112px;
  border-radius: 8px;
  object-fit: cover;
`;
const ProductName = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.textPrimary};
`;
const Price = styled.span`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.textPrimary};
`;
