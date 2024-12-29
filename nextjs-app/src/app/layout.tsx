import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AppProvider } from "@/store/AppContext";

export const metadata: Metadata = {
  title: "习惯追踪器",
  description: "一个帮助你培养好习惯的应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <ThemeProvider>
          <AppProvider>
            <div className="min-h-screen p-4 max-w-md mx-auto">
              <h1 className="text-4xl font-bold text-center mb-8 text-primary">习惯追踪</h1>
              {children}
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
