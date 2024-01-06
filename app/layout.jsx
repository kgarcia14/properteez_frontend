import { Inter } from 'next/font/google'
import '../styles/globals.css'
import {Providers} from "./providers";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Properteez App',
  description: 'Property portfolio management',
}

export default function RootLayout({ children }) {
  return (
      <html lang='en'>
        <body className={inter.className}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
  )
}
