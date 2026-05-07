import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-1">Not found</h1>
      <p className="muted mb-3">That game or player isn't on the current playoff slate.</p>
      <Link href="/" className="btn no-underline">Back to tonight</Link>
    </div>
  );
}
