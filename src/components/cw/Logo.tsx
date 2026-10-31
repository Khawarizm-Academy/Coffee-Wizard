type LogoVariant = "seal" | "primary";

const LOGOS: Record<LogoVariant, string> = {
  seal: "/brand/coffee-wizard-logo-seal.jpg",
  primary: "/brand/coffee-wizard-logo-primary.jpg",
};

export function Logo({
  className = "",
  variant = "seal",
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  if (variant === "primary") {
    return (
      <img
        src={LOGOS.primary}
        alt="Coffee Wizard official logo"
        width={120}
        height={120}
        className={`block object-contain ${className}`}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} dir="ltr">
      <img
        src={LOGOS.seal}
        alt=""
        width={44}
        height={44}
        className="h-10 w-10 shrink-0 rounded-full object-contain"
      />
      <span className="font-display text-lg font-bold leading-none tracking-tight">
        Coffee <span className="text-amber">Wizard</span>
      </span>
    </span>
  );
}
