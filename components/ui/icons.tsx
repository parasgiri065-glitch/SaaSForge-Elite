import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Shared 24×24 stroke SVG wrapper for inline icons.
 *
 * @param props - Standard SVG props plus children paths.
 * @returns An `aria-hidden` svg.
 */
function Base({ children, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconLayout({ className }: IconProps) {
  return (
    <Base className={className}>
      <rect x="3" y="3" width="7" height="18" rx="1.5" />
      <rect x="14" y="3" width="7" height="8" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Base>
  );
}

export function IconSpark({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      <circle cx="12" cy="12" r="3.2" />
    </Base>
  );
}

export function IconCard({ className }: IconProps) {
  return (
    <Base className={className}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </Base>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.2" />
      <path d="M16 14.2a4.5 4.5 0 0 1 4.5 4.8" />
    </Base>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Base>
  );
}

export function IconSun({ className }: IconProps) {
  return (
    <Base className={className}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v1.6M12 19.4V21M3 12h1.6M19.4 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3l-1.1 1.1" />
    </Base>
  );
}

export function IconMoon({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M16.5 13.2A6.2 6.2 0 1 1 10.8 7.5 5 5 0 0 0 16.5 13.2z" />
    </Base>
  );
}

export function IconSend({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M4 12l15-7-5 16-3-6-7-3z" />
    </Base>
  );
}

export function IconStop({ className }: IconProps) {
  return (
    <Base className={className}>
      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        rx="1.5"
        fill="currentColor"
        stroke="none"
      />
    </Base>
  );
}

export function IconMark({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M7 4h7l3 4-3 4H7V4z" />
      <path d="M7 12h6l3 4-3 4H7v-8z" />
    </Base>
  );
}

export function IconExternal({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M14 5h5v5" />
      <path d="M19 5l-8 8" />
      <path d="M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5" />
    </Base>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M5 12.5l4.2 4.2L19 7.5" />
    </Base>
  );
}

export function IconShield({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3z" />
      <path d="M9.5 12.2l1.8 1.8 3.4-3.6" />
    </Base>
  );
}

export function IconBolt({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M13 3L6 13h5l-1 8 7-10h-5l1-8z" />
    </Base>
  );
}

export function IconWebhook({ className }: IconProps) {
  return (
    <Base className={className}>
      <path d="M10 15.5A3.5 3.5 0 1 1 6.7 10" />
      <path d="M14 8.5A3.5 3.5 0 1 1 17.3 14" />
      <path d="M9.2 8.2A3.5 3.5 0 1 1 14.8 8.2" />
      <path d="M8.2 12.2h7.6" />
    </Base>
  );
}
