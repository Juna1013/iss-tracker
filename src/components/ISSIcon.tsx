export default function ISSIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m6 6 12 12" />
      <path d="m6 18 12-12" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
