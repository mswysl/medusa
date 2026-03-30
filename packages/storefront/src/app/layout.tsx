import type { Metadata, Viewport } from "next"
import { Bebas_Neue, Share_Tech_Mono, Cinzel_Decorative } from "next/font/google"
import "@/styles/globals.css"
import { Header } from "@/components/layout/Header"
import { BottomNav } from "@/components/layout/BottomNav"
import { CartDrawer } from "@/components/layout/CartDrawer"
import { Ticker } from "@/components/layout/Ticker"

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
})

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
  display: "swap",
})

const cinzelDecorative = Cinzel_Decorative({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MSWYSL — Underground Merch",
  description: "TRUE Underground Death Metal Merch",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MSWYSL",
  },
  icons: {
    apple: "/3dweblogo.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${shareTechMono.variable} ${cinzelDecorative.variable}`}
    >
      <body>
        {/* Background layers */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/flamechain.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "90px 90px",
            opacity: 0.12,
          }}
        />
        <div
          className="fixed inset-0 z-[1] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, rgba(8,0,12,0.45) 0%, rgba(4,0,8,0.9) 100%)",
          }}
        />
        <div
          className="fixed inset-0 z-[2] pointer-events-none bg-scanlines"
        />

        {/* App chrome */}
        <Header />
        <Ticker />

        <main
          className="relative z-10"
          style={{ paddingBottom: "calc(60px + var(--safe-bot))" }}
        >
          {children}
        </main>

        <BottomNav />
        <CartDrawer />
      </body>
    </html>
  )
}
