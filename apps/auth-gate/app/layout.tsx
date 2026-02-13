import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata = {
    title: 'FGSN Login',
    description: 'Single Sign On Portal',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${outfit.className} bg-black text-white min-h-screen`}>{children}</body>
        </html>
    )
}
