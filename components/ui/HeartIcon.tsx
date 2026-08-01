type HeartIconProps = {
  className?: string;
};

/** Soft outline heart used for CTA accents. Presentational only. */
export function HeartIcon({ className }: HeartIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1 20.4S3.5 14.6 3.5 8.9C3.5 5.9 5.7 3.8 8.5 3.8c1.6 0 3 .8 3.6 2.1.6-1.3 2-2.1 3.6-2.1 2.8 0 5 2.1 5 5.1 0 5.7-8.6 11.5-8.6 11.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.85"
      />
      <path
        d="M8.2 9.2c.35-1.15 1.45-1.85 2.55-1.55"
        opacity="0.55"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}
