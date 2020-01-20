function createHackRefId() {
  return ++createHackRefId.id
}
createHackRefId.id = 0
function encodeKV(key: string, value: string) {
  return `${key}=${encodeURIComponent(value)}`
}
function isNeedHack(value: any) {
  return hackTypes.includes(typeof value)
}
/** 获取 hack ref 的模板 */
function getHackRef(type: string, id: number | string) {
  return `<${type}:${id}>`
}
/** 转 hack ref */
function toHackRef(value: any) {
  const id = createHackRefId()
  hackMap.set(id, value)
  return getHackRef(typeof value, id)
}
function isHackRef(value: string) {
  return HackRefRegExp.test(value)
}
function getHackRefType(hackRef: string) {
  return hackRef.replace(HackRefRegExp, '$1')
}
function getHackRefId(hackRef: string) {
  return +hackRef.replace(HackRefRegExp, '$2')
}
/** 将字符串值解析为原值 */
function parseStringValue(value: string) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null') return null
  if (value === 'undefined') return undefined
  if (String(+value) === value) return +value
  if (typeof value === 'string' && /^('\d+'|"\d+"|`\d+`)$/.test(value))
    return value.slice(1, -1)
  if (isHackRef(value)) {
    const hackRef = value
    const hackRefId = getHackRefId(value)
    if (hackMap.has(hackRefId)) return hackMap.get(hackRefId)
    else return getDefaultHackValue(getHackRefType(hackRef))
  }
  const objRegExp = /^\{.*\}$|^\[.*\]$/
  if (objRegExp.test(value)) {
    try { return JSON.parse(value) }
    catch { return value }
  }
  return value
}
function getDefaultHackValue(type: string) {
  if (type === 'function') return () => {}
  if (type === 'symbol') return Symbol()
  return ''
}


interface QueryObject {
  [key: string]: any
}

const hackTypes = [
  'function',
  'symbol',
]

/** hack ref 正则 */
const HackRefRegExp = RegExp(getHackRef(`(${hackTypes.join('|')})`, '(\\d)'))

/** hack 数据：保存无法重现状态需要 hack 的值，如函数 */
const hackMap = new Map<number, any>()

export default {
  /** 将 query 对象键值序列化: `key1=value1&key2=value2` */
  stringify(query: QueryObject) {
    return Object.keys(query)
      .map(key => {
        const value = query[key]
        if (isNeedHack(value))
          return encodeKV(key, toHackRef(value))
        if (typeof value === 'object')
          return encodeKV(key, JSON.stringify(value))
        if (typeof value === 'string' && /^\d+$/.test(value))
          return encodeKV(key, `'${value}'`)
        return encodeKV(key, String(value))
      })
      .join('&')
  },
  /** 解析对象键值序列化后的字符串 */
  parse(queryStr: string) {
    const queryObj = queryStr.split('&')
      .map(item => item.split('='))
      .reduce((queryObj: any, [key, value]) => {
        queryObj[key] = value
        return queryObj
      }, {})
    return this.parseQueryObj(queryObj)
  },
  /** 将小程序 onLoad 的普通 query 对象进行解析 HackQuery 对象 */
  parseQueryObj(query: any): QueryObject {
    const hackQuery: QueryObject = {}
    Object.keys(query)
      .forEach(key => {
        const value = decodeURIComponent(query[key])
        if (typeof value !== 'string') return hackQuery[key] = value
        hackQuery[key] = parseStringValue(value)
        if (isHackRef(value)) {
          const hackRefId = getHackRefId(value)
          hackMap.delete(hackRefId)   // 释放内存，避免内存泄漏
          query[key] = hackQuery[key] // hackMap 已释放，存至原 query 中
        }
      })
    return hackQuery
  },
}
