import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-palette="carbon"
      data-gradient="sunset"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geistSans.variable)}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{const s=localStorage.getItem("theme-storage");if(s){const p=JSON.parse(s);const st=p.state||p;if(st.palette)document.documentElement.setAttribute("data-palette",st.palette);if(st.gradient)document.documentElement.setAttribute("data-gradient",st.gradient);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
