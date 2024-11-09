export function HealthBadgeId({ className, size, strokeWidth }: { className?: string; strokeWidth?: number; size?: number }) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size || 24} height={size || 24} viewBox='0 0 24 24' className={className}>
      <g fill='none'>
        <path
          d='M10 4H2C1.44772 4 1 4.44772 1 5V19C1 19.5523 1.44772 20 2 20H22C22.5523 20 23 19.5523 23 19V5C23 4.44772 22.5523 4 22 4H14M15 11H18M15 15H20M9.85234 9.85409C9.85234 10.8781 9.02223 11.7082 7.99825 11.7082C6.97426 11.7082 6.14416 10.8781 6.14416 9.85409C6.14416 8.8301 6.97426 8 7.99825 8C9.02223 8 9.85234 8.8301 9.85234 9.85409ZM3.88 17.7974C3.90221 15.5409 5.73829 13.7186 8 13.7186C10.2617 13.7186 12.0978 15.5409 12.12 17.7974C12.1202 17.8202 12.1018 17.8388 12.079 17.8388H3.921C3.89824 17.8388 3.87978 17.8202 3.88 17.7974ZM11 6H13C13.5523 6 14 5.55228 14 5V3C14 2.44772 13.5523 2 13 2H11C10.4477 2 10 2.44772 10 3V5C10 5.55228 10.4477 6 11 6Z'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={strokeWidth || 2}
        ></path>
      </g>
    </svg>
  );
}