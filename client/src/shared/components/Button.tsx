import styled from "@emotion/styled";
import { colors, fonts } from "../styles/tokens";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean; // 하단 full-width 버튼용 (Phase 9)
  children: ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton variant={variant} fullWidth={fullWidth} type={type} {...rest}>
      {children}
    </StyledButton>
  );
}

const variantStyles = {
  primary: `
    background: ${colors.ctaActive};
    color: ${colors.background};
  `,
  ghost: `
    background: transparent;
    color: ${colors.textPrimary};
    border: 1px solid ${colors.divider};
  `,
};

const StyledButton = styled.button<{ variant: Variant; fullWidth: boolean }>`
  font-family: ${fonts.button.fontFamily};
  font-weight: ${fonts.button.fontWeight};
  font-size: ${fonts.button.fontSize};
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.15s;
  ${({ fullWidth }) => fullWidth && "width: 100%;"}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${({ variant }) => variantStyles[variant]}
`;
