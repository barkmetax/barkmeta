export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <text x="0" y="24" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="24" fill="#ffffff">
        BarkPush
      </text>
      <circle cx="148" cy="22" r="4" fill="#d4a843" />
    </svg>
  );
}
