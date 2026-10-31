// The official logo file is not in the repository yet; keep a text-only brand name rather than a fabricated mark.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display inline-flex items-center text-lg font-bold leading-none tracking-tight ${className}`}
      dir="ltr"
    >
      Coffee <span className="text-amber">Wizard</span>
    </span>
  );
}
