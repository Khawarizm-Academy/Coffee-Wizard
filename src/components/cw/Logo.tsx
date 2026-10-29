// Stand-in hat logo echoing the Coffee Wizard cup mark — swap with the official logo file when supplied.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 32" aria-hidden="true" className="h-7 w-auto" fill="currentColor">
        <path d="M4 26c6-2 14-2.5 22-1.5 4 .5 7 .2 10-1.2-2 4-8 6-16 6S4 28 4 26z" />
        <path d="M10 24c1-7 5-13 12-16 2-1 4-.5 5 1-3 1-5 3-5 6 3-2 6-2 8 1-2-.2-4 .5-5 2 3 1 5 3 6 6-6-1-14-1-21 0z" />
        <path d="M30 2l1 2.3L33.3 5 31 6l-1 2.3L29 6l-2.3-1L29 4.3zM35 8l.6 1.4L37 10l-1.4.6L35 12l-.6-1.4L33 10l1.4-.6z" />
      </svg>
      <span className="font-display text-lg font-bold leading-none tracking-tight" dir="ltr">
        Coffee <span className="text-amber">Wizard</span>
      </span>
    </span>
  );
}
