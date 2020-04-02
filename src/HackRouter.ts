import HackQuery from './HackQuery'

const mp =
  typeof wx !== 'undefined' ? wx  // 微信
    : typeof my !== 'undefined' ? my  // 支付宝
      : typeof dd !== 'undefined' ? dd  // 钉钉
        : typeof tt !== 'undefined' ? tt  // 头条
          : null

interface RouteConfig {
  /**
   * 页面跳转类型
   * - navigate: 打开目标页面
   * - redirect: 重定向到目标页面
   * - reLaunch: 关闭所有页面打开目标页面
   * - switchTab: 切换到目标 tab bar 页面
   * - none: 不进行任何页面跳转操作
   */
  type: 'navigate' | 'redirect' | 'reLaunch' | 'switchTab' | 'none'
  /** 页面路由 */
  url: string
  /** 查询参数 */
  query?: any
}

type Plugin = (config: RouteConfig) => void
const plugins = new Set<Plugin>()

function hackNavigate(config: RouteConfig) {
  for (let plugin of plugins)
    plugin(config)
  return new Promise<void>((success, fail) => {
    if (config.type === 'none') return success()
    let url = config.url
    if (config.query)
      url += '?' + HackQuery.stringify(config.query)
    const navigateType =
      config.type === 'navigate' ? 'navigateTo'
        : config.type === 'redirect' ? 'redirectTo'
          : config.type === 'reLaunch' ? 'reLaunch'
            : config.type === 'switchTab' ? 'switchTab'
              : 'navigateTo'
    mp?.[navigateType]({ url, success, fail })
  })
}

export default {
  /** 路由插件 */
  plugins,

  /** 打开目标页面 */
  goTo(url: string, query?: any) {
    hackNavigate({ type: 'navigate', url, query })
  },
  /** 返回到上一个页面 */
  goBack(delta?: number) {
    mp?.navigateBack(delta)
  },
  /** 重定向到目标页面 */
  redirectTo(url: string, query?: any) {
    hackNavigate({ type: 'redirect', url, query })
  },
  /** 切换到目标 tab bar 页面 */
  switchTab(url: string, query?: any) {
    hackNavigate({ type: 'switchTab', url, query })
  },
  /** 切换到目标 tab bar 页面 */
  reLaunch(url: string, query?: any) {
    hackNavigate({ type: 'reLaunch', url, query })
  },
}
