import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-soft via-background to-[#e8f2f3] p-4 dark:from-card dark:via-background dark:to-[#0c1f28]">
      {children}
    </div>
  );
}
