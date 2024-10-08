import type { Metadata } from "next";
import { AuthProvider } from "@/components/common/AuthProvider";
import { StoreProvider } from '@/components/common/StoreProvider';
import "./globals.css";

export const metadata: Metadata = {
  title: "Payroll Portal",
  description: "Manage employees and process salaries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
