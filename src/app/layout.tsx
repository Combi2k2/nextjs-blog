"use client"
import "./globals.css"
import Header from "@/components/Header"
import { ThemeProvider } from "next-themes"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className="dark:bg-stone-900">
                <ThemeProvider enableSystem={true} attribute="class">
                    <Header />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
