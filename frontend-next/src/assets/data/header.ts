export type Navigation = {
  title: string
  href: string
  items?: { title: string; href: string; description?: string }[]
}

export const navigationData: Navigation[] = [
  { title: '首页', href: '/#home' },
  { title: '功能介绍', href: '/#features' },
  { title: '使用方式', href: '/#how-it-works' },
  { title: '常见问题', href: '/#faq' }
]
