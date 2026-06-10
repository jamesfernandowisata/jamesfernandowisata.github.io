import type { Metadata } from "next";
import BackgroundRotator from "@/components/background-rotator";
import { ThemeInitializer } from "@/components/theme-toggle";
import VisitTracker from "@/components/visit-tracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "James Fernando | Portfolio OS",
  description:
    "A desktop-style portfolio for James Fernando's projects, games, and web experiments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BackgroundRotator />
        <ThemeInitializer />
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
