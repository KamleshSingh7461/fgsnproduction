import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'] })

export const metadata = {
    title: 'FGSN Admin Dashboard',
    description: 'Management Portal',
}

import dynamic from 'next/dynamic'
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${outfit.className} bg-zinc-950 text-white min-h-screen flex`}>
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </body>
        </html>
    )
}
