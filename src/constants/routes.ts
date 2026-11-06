export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]

