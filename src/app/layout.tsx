import { Inter } from 'next/font/google'
import './globals.css'
import CssBaseline from '@mui/material/CssBaseline'

const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'Face Recognition App',
  description: 'Real-time face recognition application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />
        {children}
      </body>
    </html>
  )
}