import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { Toaster } from "@/components/ui/toast"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "StudioSpace — Book creative studios by the hour",
    template: "%s · StudioSpace",
  },
  description:
    "StudioSpace is a peer-to-peer marketplace for photo studios, sound stages, podcast rooms, music suites, and art workshops. Discover a space, pick your hours, and book instantly.",
  keywords: [
    "studio rental",
    "photo studio",
    "sound stage",
    "podcast studio",
    "music studio",
    "art workshop",
    "creative workspace",
  ],
  openGraph: {
    title: "StudioSpace — Book creative studios by the hour",
    description:
      "Discover remarkable creative spaces and book them by the hour. Built for filmmakers, photographers, podcasters, musicians, and makers.",
    type: "website",
    siteName: "StudioSpace",
  },
}

const themeInitScript = `(function(){try{var s=localStorage.getItem("studiospace-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})()`

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  )
}
