import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { DashboardPage } from '@/pages/dashboard'
import { NotFoundPage } from '@/pages/NotFound'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/context/AuthContext'
import { Loader } from '@/components/atoms/Loader'
import { Suspense } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import AllPatients from './pages/AllPatients'
import PatientChart from './pages/PatientChart'

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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="drcloud-theme">
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
