import styled from "@emotion/styled";
import type { CartItem } from "../types";
import { colors } from "../../../shared/styles/tokens";
import { QuantityStepper } from "./QuantityStepper";
import { Checkbox } from "../../../shared/components/CheckBox";
import { Row, Stack } from "../../../shared/components/layout";

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggle: () => void;
  onUpdateQuantity: (next: number) => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  isSelected,
  onToggle,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const handleRemove = () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    onRemove();
  };

  return (
    <ItemWrapper>
      <Stack gap={12}>
        <Row justify="space-between" align="center">
          <Checkbox checked={isSelected} onChange={onToggle} />
          <DeleteButton type="button" onClick={handleRemove}>
            삭제
          </DeleteButton>
        </Row>
        <Row gap={24}>
          <ProductImage src={item.product.imageUrl} alt={item.product.name} />
          <Stack gap={4} flex={1}>
            <ProductName>{item.product.name}</ProductName>
            <Price>{item.product.price.toLocaleString()}원</Price>
            <QuantityStepper
              value={item.quantity}
              onChange={onUpdateQuantity}
            />
          </Stack>
        </Row>
      </Stack>
    </ItemWrapper>
  );
}

const ItemWrapper = styled.li`
  padding: 12px 0;
  border-top: 1px solid ${colors.divider};
  list-style: none;
`;

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

const DeleteButton = styled.button`
  width: 40px;
  height: 24px;
  background: #ffffff;
  border: 1px solid ${colors.divider};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.textPrimary};
  cursor: pointer;
`;
