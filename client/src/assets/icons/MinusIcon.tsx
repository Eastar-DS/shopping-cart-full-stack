type Props = { width?: number; height?: number; color?: string };

export const MinusIcon = ({
  width = 14,
  height = 2,
  color = "currentColor",
}: Props) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.75 0.75C5.43629 0.75 8.06371 0.75 12.75 0.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
