import { Outlet } from 'react-router-dom'
import type { FC } from 'react'

export const RootLayout: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Outlet />
      </main>
    </div>
  )
} 