export function LogoMark({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      <rect x="8" y="16" width="40" height="13" rx="6.5" fill="var(--primary)" />
      <rect x="16" y="35" width="40" height="13" rx="6.5" fill="var(--steel)" />
    </svg>
  );
}
