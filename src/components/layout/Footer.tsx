import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          © {CURRENT_YEAR} GCC Website. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link to={ROUTES.HOME} className="hover:text-slate-200 transition-colors">
            Home
          </Link>
          <Link to={ROUTES.ABOUT} className="hover:text-slate-200 transition-colors">
            About
          </Link>
          <Link to={ROUTES.CONTACT} className="hover:text-slate-200 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
