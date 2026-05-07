import type { Metadata } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";
import { Footer } from "@/components/footer";
import Link from "next/link";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nba-playoff-props.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NBA Playoff Props. Plain English Predictions.",
    template: "%s | NBA Playoff Props"
  },
  description:
    "Player prop predictions for the NBA playoffs. Updated every 30 minutes. Free.",
  openGraph: {
    title: "NBA Playoff Props",
    description:
      "Player prop predictions for the NBA playoffs. Updated every 30 minutes. Free.",
    url: siteUrl,
    siteName: "NBA Playoff Props"
  },
  twitter: {
    card: "summary_large_image",
    title: "NBA Playoff Props",
    description:
      "Player prop predictions for the NBA playoffs. Updated every 30 minutes. Free."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <header className="border-b border-ink-700">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold no-underline hover:no-underline">
              NBA Playoff Props
            </Link>
            <nav className="flex items-center gap-4 text-sm subtle">
              <Link href="/historical" className="no-underline hover:underline">
                Accuracy
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
