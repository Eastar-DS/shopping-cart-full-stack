type Props = { width?: number; height?: number; color?: string };

export const PlusIcon = ({
  width = 14,
  height = 14,
  color = "currentColor",
}: Props) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.75 6.75H12.75M6.75 12.75V0.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
