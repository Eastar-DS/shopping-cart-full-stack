type Props = { width?: number; height?: number; color?: string };

export const BackIcon = ({
  width = 32,
  height = 32,
  color = "currentColor",
}: Props) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="..." fill={color} />
  </svg>
);
