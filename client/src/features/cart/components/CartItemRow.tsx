import styled from "@emotion/styled";
import type { CartItem } from "../types";
import { colors } from "../../../shared/styles/tokens";
import { CheckIcon } from "../../../assets/icons/CheckIcon";
import { QuantityStepper } from "./QuantityStepper";

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggle: () => void;
}

export function CartItemRow({ item, isSelected, onToggle }: CartItemRowProps) {
  return (
    <Row>
      <TopRow>
        <CheckboxLabel>
          <HiddenCheckbox
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
          />
          <CheckboxBox $checked={isSelected}>
            <CheckIcon color={isSelected ? "#fff" : "rgba(0, 0, 0, 0.1)"} />
          </CheckboxBox>
        </CheckboxLabel>
        <DeleteButton type="button">삭제</DeleteButton>
      </TopRow>
      <BottomRow>
        <ProductImage src={item.product.imageUrl} alt={item.product.name} />
        <InfoStack>
          <ProductName>{item.product.name}</ProductName>
          <Price>{item.product.price.toLocaleString()}원</Price>
          <QuantityStepper
            value={item.quantity}
            onChange={(next) => console.log("TODO: PATCH", item.id, next)}
          />
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
  gap: 8px;
`;

const ProductName = styled.span`
  font-size: 16px;
  color: ${colors.textPrimary};
`;

const Price = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.textPrimary};
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
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  cursor: pointer;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const CheckboxBox = styled.span<{ $checked: boolean }>`
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: ${({ $checked }) => ($checked ? "#000" : "#fff")};
  border: 1px solid
    ${({ $checked }) => ($checked ? "#000" : "rgba(0, 0, 0, 0.1)")};
  transition: all 0.15s;
`;
