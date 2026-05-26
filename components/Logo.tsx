export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M13 27V13h5.5c2.485 0 4.5 2.015 4.5 4.5S20.985 22 18.5 22H17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="27" cy="14" r="2" fill="currentColor" />
      </svg>
      <span
        className="font-display text-xl font-medium tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        Peptigene
      </span>
    </div>
  );
}
