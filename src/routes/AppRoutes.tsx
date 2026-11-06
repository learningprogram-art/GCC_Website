import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { ROUTES } from '@/constants/routes'

// Route-level code splitting
const HomePage = lazy(() => import('@/pages/Home'))

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          {/* Add more routes here as pages are built */}
        </Route>
      </Routes>
    </Suspense>
  )
}
