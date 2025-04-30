import { Outlet } from 'react-router-dom'
import type { FC } from 'react'
import { Toaster } from "@/components/ui/toaster"

export const RootLayout: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
} 