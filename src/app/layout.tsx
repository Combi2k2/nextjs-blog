import "./globals.css"
import Header from "@/components/Header"
import { ThemeProvider } from "next-themes"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Combi2k2',
  description: 'A modern blog built with Next.js',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body className="dark:bg-stone-900">
                <ThemeProvider 
                    enableSystem={true} 
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange={false}
                >
                    <Header />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
