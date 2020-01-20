interface NavigateConfig {
  url: string
  success?(): void
  fail?(): void
  complete?(): void
}

interface Mp {
  switchTab(config: NavigateConfig): void
  reLaunch(config: NavigateConfig): void
  redirectTo(config: NavigateConfig): void
  navigateTo(config: NavigateConfig): void
  navigateBack(delta?: number): void
}

declare const wx: Mp
declare const my: Mp
declare const dd: Mp
declare const tt: Mp
