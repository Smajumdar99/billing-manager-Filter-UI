import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { SignupPage } from '@/pages/signup'
import { DashboardPage } from '@/pages/dashboard'
import OldUIDashboard from '@/pages/OldUIDashboard'
import BillingPage from '@/pages/BillingPage'
import PracticePage from '@/pages/PracticePage'
import ReportsPage from '@/pages/ReportsPage'
import AdministrationPage from '@/pages/AdministrationPage'
import WaitListPage from '@/pages/WaitListPage'
import ADLPage from '@/pages/ADLPage'
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
import MyCalendar from './pages/MyCalendar'
import TaskHub from './pages/TaskHub'
import StaffDashboard from './pages/StaffDashboard'
import ClientsPage from './pages/ClientsPage'
import { TaskProvider } from '@/context/TaskContext'
import NewAppointmentPage from './pages/NewAppointmentPage'

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
      <Route 
        path="/my-calendar" 
        element={
          <ProtectedRoute>
            <MyCalendar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/task-hub" 
        element={
          <ProtectedRoute>
            <TaskHub />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/staff-dashboard" 
        element={
          <ProtectedRoute>
            <StaffDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/clients" 
        element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/old-ui-dashboard" 
        element={
          <ProtectedRoute>
            <OldUIDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/billing" 
        element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/practice" 
        element={
          <ProtectedRoute>
            <PracticePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/administration" 
        element={
          <ProtectedRoute>
            <AdministrationPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/wait-list" 
        element={
          <ProtectedRoute>
            <WaitListPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/adl" 
        element={
          <ProtectedRoute>
            <ADLPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/new-appointment" element={<NewAppointmentPage />} />
      <Route path="*" element={<ComingSoonPage />} />
    </Routes>
  )
}

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="drcloud-theme">
      <FontProvider>
        <AuthProvider>
          <TaskProvider>
            <BrowserRouter>
              <Suspense fallback={<Loader />}>
                <AppRoutes />
              </Suspense>
            </BrowserRouter>
            <Toaster />
          </TaskProvider>
        </AuthProvider>
      </FontProvider>
    </ThemeProvider>
  )
}

export default App
