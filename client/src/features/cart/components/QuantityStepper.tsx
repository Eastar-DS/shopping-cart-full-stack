import styled from "@emotion/styled";
import { PlusIcon } from "../../../assets/icons/PlusIcon";
import { MinusIcon } from "../../../assets/icons/MinusIcon";

const MIN = 1;
const MAX = 99;

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
}

export function QuantityStepper({ value, onChange }: QuantityStepperProps) {
  return (
    <Container>
      <IconButton
        type="button"
        disabled={value <= MIN}
        onClick={() => onChange(value - 1)}
        aria-label="수량 감소"
      >
        <MinusIcon />
      </IconButton>
      <Value>{value}</Value>
      <IconButton
        type="button"
        disabled={value >= MAX}
        onClick={() => onChange(value + 1)}
        aria-label="수량 증가"
      >
        <PlusIcon />
      </IconButton>
    </Container>
  );
}

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #363636;
`;

const IconButton = styled.button`
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  cursor: pointer;
  color: inherit;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.04);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Value = styled.span`
  width: 24px;
  text-align: center;
  font-size: 12px;
`;
