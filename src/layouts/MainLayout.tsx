import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#252422] text-[#FFFCF2]">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout

