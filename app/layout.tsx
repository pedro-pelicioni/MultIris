import type React from "react"
import type { Metadata } from "next"
import { Mulish } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { MiniKitProvider } from "@/components/minikit-provider"

const mulish = Mulish({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MultIris - Multisig Wallet with World ID",
  description: "A multisignature wallet secured by World ID verification",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${mulish.className} bg-white text-black`}>
        <MiniKitProvider appId="multiris-wallet">
          {children}
          <Toaster />
        </MiniKitProvider>
      </body>
    </html>
  )
}



import './globals.css'