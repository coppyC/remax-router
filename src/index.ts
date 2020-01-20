import HackQuery from './HackQuery'
import HackRouter from './HackRouter'
import { useQuery } from 'remax'
import { useState } from 'react'


/** 创建 onClick 页面链接 */
export const createHackLink = (url: string, query?: any) =>
  () => HackRouter.goTo(url, query)

/** 重定向链接 */
createHackLink.redirect = (url: string, query?: any) =>
  () => HackRouter.redirectTo(url, query)

/** tab bar 链接 */
createHackLink.switchTab = (url: string, query?: any) =>
  () => HackRouter.switchTab(url, query)

/** 重启链接 */
createHackLink.reLaunch = (url: string, query?: any) =>
  () => HackRouter.reLaunch(url, query)

/** 返回链接 */
createHackLink.back = (delta?: number) =>
  () => HackRouter.goBack(delta)

function useHackQuery<Q = any>(): Q {
  const query: any = useQuery()
  const [hackQuery] = useState<any>(() => (
    HackQuery.parseQueryObj(query)
  ))
  return hackQuery
}

export { HackQuery, HackRouter, createHackLink as createHackLink, useHackQuery }
