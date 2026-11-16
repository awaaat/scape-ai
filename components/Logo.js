// The Scape AI logo (public/logo.webp). Height is in px; width follows the artwork's ratio.
export default function Logo({ size = 40 }) {
  return (<img className="lg-img" src="/logo.webp" alt="Scape AI" height={size} width={Math.round(size * 480 / 141)} decoding="async" />);
}
