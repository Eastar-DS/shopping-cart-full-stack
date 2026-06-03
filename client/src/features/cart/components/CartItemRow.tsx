import styled from "@emotion/styled";
import type { CartItem } from "../types";
import { colors } from "../../../shared/styles/tokens";

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggle: () => void;
}

export function CartItemRow({ item, isSelected, onToggle }: CartItemRowProps) {
  return (
    <Row>
      <input type="checkbox" checked={isSelected} onChange={onToggle} />
      <Body>
        <div>{item.product.name}</div>
        <div>{item.product.price.toLocaleString()}원</div>
        <div>수량: {item.quantity}</div>
        <button>삭제</button>
      </Body>
    </Row>
  );
}

const Row = styled.div`
  padding: 16px 0;
  border-top: 1px solid ${colors.divider};
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const Body = styled.div`
  flex: 1;
`;
