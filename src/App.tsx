import { useState } from 'react'
import { Code2, Sparkles, Layers, Rocket, Globe } from 'lucide-react'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25">
            <Globe className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            GCC Website
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          React + Vite + Tailwind CSS Ready
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-sm mb-6">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Modern React 19 & Vite 8 Setup</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
          Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">GCC Website</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mb-8 leading-relaxed">
          Your project has been successfully initialized with React, Vite, TypeScript, and Tailwind CSS. Start building your components and pages.
        </p>

        {/* Counter Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur max-w-md w-full mb-10">
          <div className="text-sm font-medium text-slate-400 mb-3">Interactive State Test</div>
          <button
            onClick={() => setCount((prev) => prev + 1)}
            className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition-all font-semibold text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            Count is: {count}
          </button>
          <p className="text-xs text-slate-500 mt-3">
            Edit <code className="text-indigo-300 bg-slate-800/80 px-1.5 py-0.5 rounded font-mono">src/App.tsx</code> to see live HMR updates
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 mb-3">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">TypeScript</h3>
            <p className="text-sm text-slate-400">Strict type safety configured out of the box with tsconfig.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Tailwind CSS v4</h3>
            <p className="text-sm text-slate-400">Lightning-fast utility styling powered by Vite integration.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-9 h-9 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 mb-3">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Instant HMR</h3>
            <p className="text-sm text-slate-400">Vite dev server providing sub-second hot module replacement.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500">
        GCC Website • Initialized with React, Vite & Tailwind CSS
      </footer>
    </div>
  )
}

export default App
