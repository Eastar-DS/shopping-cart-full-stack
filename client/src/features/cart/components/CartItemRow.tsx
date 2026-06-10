import styled from "@emotion/styled";
import type { CartItem } from "../types";
import { colors } from "../../../shared/styles/tokens";
import { QuantityStepper } from "./QuantityStepper";
import { Checkbox } from "../../../shared/components/CheckBox";

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
    <Row>
      <TopRow>
        <Checkbox checked={isSelected} onChange={onToggle} />
        <DeleteButton type="button" onClick={handleRemove}>
          삭제
        </DeleteButton>
      </TopRow>
      <BottomRow>
        <ProductImage src={item.product.imageUrl} alt={item.product.name} />
        <InfoStack>
          <ProductName>{item.product.name}</ProductName>
          <Price>{item.product.price.toLocaleString()}원</Price>
          <QuantityStepper value={item.quantity} onChange={onUpdateQuantity} />
        </InfoStack>
      </BottomRow>
    </Row>
  );
}

const Row = styled.li`
  padding: 12px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  list-style: none;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
`;

const BottomRow = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 12px;
`;

const ProductImage = styled.img`
  width: 112px;
  height: 112px;
  border-radius: 8px;
  object-fit: cover;
`;

const InfoStack = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
`;

const ProductName = styled.span`
  font-size: 12px;
  font-weight: 500;
  height: 15px;
  color: ${colors.textPrimary};
`;

const Price = styled.span`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 20px;
`;

const DeleteButton = styled.button`
  width: 40px;
  height: 24px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${colors.textPrimary};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
