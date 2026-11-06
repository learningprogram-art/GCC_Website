export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

