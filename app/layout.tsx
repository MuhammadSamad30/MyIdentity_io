import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyIdentity.io | ID card design studio",
  description: "Design professional student, employee, and membership cards with live preview and print-ready export.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

