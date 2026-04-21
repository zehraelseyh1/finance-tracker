import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <html lang="tr">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}