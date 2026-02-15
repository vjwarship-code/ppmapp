import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  title: "PPM App - Project Portfolio Management",
  description: "Comprehensive Project Portfolio Management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
