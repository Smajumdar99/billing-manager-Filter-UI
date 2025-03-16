import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { SignupPage } from '@/pages/signup'
import { DashboardPage } from '@/pages/dashboard'
import { ComingSoonPage } from '@/pages/NotFound'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/context/AuthContext'
import { Loader } from '@/components/atoms/Loader'
import { Suspense } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { FontProvider } from '@/contexts/FontContext'
import AllPatients from './pages/AllPatients'
import PatientChart from './pages/PatientChart'
import Settings from './pages/Settings'
import { Toaster } from "@/components/ui/toaster"
import OldUI from './pages/OldUI'
import Inbox from './pages/Inbox'
import Schedule from './pages/Schedule'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <Loader />
  }
  
  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const AppRoutes = () => {
  const { loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/patient-care/all-patients" element={<AllPatients />} />
      <Route path="/patient-chart/:patientId" element={<PatientChart />} />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/old-ui" 
        element={
          <ProtectedRoute>
            <OldUI />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/inbox" 
        element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/schedule" 
        element={
          <ProtectedRoute>
            <Schedule />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<ComingSoonPage />} />
    </Routes>
  )
}

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="drcloud-theme">
      <FontProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<Loader />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </FontProvider>
    </ThemeProvider>
  )
}

export default App
