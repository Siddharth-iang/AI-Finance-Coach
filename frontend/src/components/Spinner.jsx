export default function Spinner({ size = 24, className = "" }) {
  return (
    <div
      className={`rounded-full border-2 border-violet-500 border-t-transparent animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}