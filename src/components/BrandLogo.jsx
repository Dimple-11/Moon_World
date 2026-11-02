import React, { useId } from 'react';

/** Shared sakura "D" mark used by the navbar and footer. */
export default function BrandLogo({ size = 28, className = '' }) {
  const gradientId = useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E891B4" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="8" fill={`url(#${gradientId})`} />
      <text x="5" y="21" fontFamily="Outfit,sans-serif" fontWeight="800" fontSize="18" fill="white">D</text>
      <circle cx="22" cy="6" r="3" fill="white" opacity="0.85" />
      <circle cx="22" cy="6" r="1.2" fill={`url(#${gradientId})`} />
    </svg>
  );
}
