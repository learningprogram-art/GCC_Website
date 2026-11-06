# GCC Website — Project Architecture & Folder Structure Guidelines

This document outlines the official architectural standards, folder structure, design principles, and best practices for the **GCC Website** project. All team members and contributors should adhere to these guidelines to ensure consistency, scalability, maintainability, and optimal build performance.

---

## 1. High-Level Architecture Pattern

The project uses a **Hybrid Feature-Driven Architecture**:
- **Shared / Foundation Layer:** Generic UI primitives, layouts, global utilities, hooks, types, and services.
- **Feature Layer:** Business domains are partitioned into self-contained modules (`src/features/`), each encapsulating its own components, API calls, hooks, and types.
- **Page Layer:** Thin view containers that assemble layouts and features without holding heavy business logic.

---

## 2. Directory Tree

```
GCC_Website/
├── public/                     # Static assets copied untouched to /dist
│   ├── favicon.svg             # Favicon
│   └── robots.txt              # Search engine crawling rules
│
├── src/
│   ├── assets/                 # Bundled static assets processed by Vite (SVGs, images, fonts)
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/             # Reusable, domain-agnostic UI elements
│   │   ├── ui/                 # Primitive design system elements (Button, Input, Card, Modal)
│   │   ├── feedback/           # User feedback states (LoadingSpinner, ErrorBoundary, Skeleton)
│   │   └── common/             # Compound shared widgets (SearchBar, Pagination, Table)
│   │
│   ├── constants/              # Application-wide fixed values & config
│   │   ├── routes.ts           # Route path constants (e.g. ROUTES.HOME, ROUTES.ABOUT)
│   │   └── appConfig.ts        # App metadata, social links, contact info
│   │
│   ├── context/                # Global React context providers (Theme, Auth, Toast)
│   │
│   ├── features/               # Domain-driven feature modules
│   │   └── [feature-name]/     # e.g., auth, events, programs, members
│   │       ├── api/            # Feature-specific endpoints & queries
│   │       ├── components/     # UI components unique to this feature
│   │       ├── hooks/          # Custom hooks scoped to this feature
│   │       ├── types/          # Feature DTOs, interfaces & payloads
│   │       └── index.ts        # Public API / barrel export for the feature
│   │
│   ├── hooks/                  # Global reusable React hooks (useMediaQuery, useDebounce, etc.)
│   │
│   ├── layouts/                # Page shell templates
│   │   ├── MainLayout.tsx      # Default layout: Header + <Outlet /> + Footer
│   │   └── AuthLayout.tsx      # Minimalist layout for login/signup flows
│   │
│   ├── pages/                  # Route views (lightweight page containers)
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/                 # Routing configuration & guards
│   │   ├── AppRoutes.tsx       # Route definitions & React.lazy code splitting
│   │   └── ProtectedRoute.tsx  # Authentication/role guard wrapper
│   │
│   ├── services/               # External communication & persistent storage
│   │   ├── api.ts              # Fetch/Axios instance, base configuration & interceptors
│   │   └── storage.ts          # Safe wrapper for localStorage/sessionStorage
│   │
│   ├── types/                  # Global TypeScript definitions & ambient declarations
│   │   └── index.ts
│   │
│   ├── utils/                  # Pure helper functions (no React dependencies)
│   │   ├── cn.ts               # Tailwind class merging utility (clsx + tailwind-merge)
│   │   ├── formatters.ts       # Date, currency, string formatting
│   │   └── validators.ts       # Form validation schemas / functions
│   │
│   ├── App.tsx                 # Root app component (Providers + Router)
│   ├── main.tsx                # Entry point mounting React to DOM
│   ├── index.css               # Global Tailwind CSS entry
│   └── vite-env.d.ts           # Vite client environment variable typing
│
├── .env.example                # Template of environment variables
├── .gitignore                  # Git untracked patterns
├── .oxlintrc.json              # Oxlint linting configuration
├── index.html                  # Vite HTML entry template
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # Root TypeScript configuration
├── tsconfig.app.json           # Application TypeScript configuration with path aliases
└── vite.config.ts              # Vite plugins, build settings, and path alias resolvers
```

---

## 3. Directory Responsibilities

### `src/components/` vs `src/features/`
- **`src/components/`** is for **reusable, domain-agnostic UI**. If a component has no concept of "GCC programs", "members", or "auth token", it belongs here.
  - `ui/`: Buttons, Inputs, Badges, Modals, Dropdowns.
  - `feedback/`: Loading spinners, skeleton loaders, error boundaries.
  - `common/`: Navbar, Footer, Breadcrumbs, Pagination.
- **`src/features/`** is for **domain-specific logic**. If a component fetches data from a specific API endpoint or depends on domain state (e.g., `ProgramCard.tsx`, `LoginForm.tsx`), it belongs inside its respective feature folder.

### `src/pages/`
Pages should be **thin orchestrators**:
- They import layout wrappers and feature components.
- They do **not** contain 300+ lines of raw JSX or complex business logic.
- They act as the top-level route endpoint mapped directly in `src/routes/AppRoutes.tsx`.

### `src/services/`
All network communication is isolated here. Components never make direct, unconfigured `fetch()` calls. Centralizing API calls ensures:
- Consistent error handling.
- Uniform header injection (e.g., Auth Bearer tokens).
- Single source of truth for base URLs and timeouts.

---

## 4. Architectural Rules & Standards

### 1. Path Aliasing (`@/*`)
Never use long relative paths like `../../../../components/ui/Button`. Always use the configured `@/` alias:
```tsx
// ✅ Correct
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

// ❌ Incorrect
import { Button } from '../../../components/ui/Button'
```

### 2. Route-Level Code Splitting (Lazy Loading)
All route pages must be loaded lazily with `React.lazy()` and wrapped in a `<Suspense>` fallback:
```tsx
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
```

### 3. Tailwind Styling with `cn()` Helper
When accepting `className` props in UI components, always merge classes using the `cn()` utility (`clsx` + `tailwind-merge`) to avoid CSS specificity collisions:
```tsx
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
        variant === 'primary' && 'bg-indigo-600 text-white hover:bg-indigo-500',
        variant === 'secondary' && 'bg-slate-800 text-slate-200 hover:bg-slate-700',
        className
      )}
      {...props}
    />
  )
}
```

### 4. Environment Variables
- Every environment variable must start with `VITE_`.
- All variables must be documented in `.env.example`.
- TypeScript definitions for `import.meta.env` must be maintained in `src/vite-env.d.ts`.

---

## 5. Development Workflow & Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server with Vite HMR |
| `npm run build` | Compiles TypeScript (`tsc -b`) and generates production bundle (`vite build`) |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs the Oxlint linter across codebase |

