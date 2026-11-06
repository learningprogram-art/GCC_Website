const CURRENT_YEAR = new Date().getFullYear()

export function FooterSection() {
  return (
    <footer id="footer" className="py-12 px-6 border-t border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
        {/* Figma node: 211:5523 • Desktop footer — Garg Core Construction */}
        © {CURRENT_YEAR} Garg Core Construction. All rights reserved.
      </div>
    </footer>
  )
}
