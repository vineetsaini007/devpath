import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "DevPath — Make your next move",
  description:
    "Curated developer resources and a personal four-week learning roadmap.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
