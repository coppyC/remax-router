function createHackRefId() {
  return ++createHackRefId.id
}
createHackRefId.id = 0
function encodeKV(key: string, value: string) {
  return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
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
/** 将值字符串化 */
function stringifyValue(value: any) {
  if (isNeedHack(value))
    return toHackRef(value)
  if (typeof value === 'object')
    return JSON.stringify(value)
  if (typeof value === 'string' && /^\d+$/.test(value))
    return `'${value}'`
  return String(value)
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
    if (hackMap.has(hackRefId)) {
      const value = hackMap.get(hackRefId)
      hackMap.delete(hackRefId)
      return value
    } else {
      return getDefaultHackValue(getHackRefType(hackRef))
    }
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

/** 本地 hack 数据仓库：保存无法重现状态需要 hack 的值，如函数 */
const hackMap = new Map<number, any>()

export default {
  /** 将 query 对象键值序列化: `key1=value1&key2=value2` */
  stringify(query: QueryObject) {
    return Object.keys(query)
      .map(key => {
        const value = query[key]
        return encodeKV(key, stringifyValue(value))
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
  /**
   * 将小程序 onLoad 的普通 query 对象进行解析 HackQuery 对象
   * @warning 为了避免内存泄漏，在解析后会马上释放hackMap的内存，所以对hack值只能解析一次，
   * 请将解析后的对象自行保存，若再次解析，则无法找到对应hack值，会返回默认hack值
   * @other 对于分享出去的hackId, 通过分享链接进来时，会找不到本地对应的hack值，
   * 因为本地的 hackId 是一次性的，一旦被解析，就会释放内存，
   * 而hackId又只在页面跳转前存储在本地，页面跳转后又马上被解析释放，故本地仓库不会与分享出去的外部 hackId 发生冲突
   */
  parseQueryObj(query: any): QueryObject {
    const hackQuery: QueryObject = {}
    Object.keys(query)
      .forEach(key => {
        const value = decodeURIComponent(query[key])
        key = decodeURIComponent(key)
        if (typeof value !== 'string')
          return hackQuery[key] = value
        hackQuery[key] = parseStringValue(value)
        if (isHackRef(value)) {
          const hackRefId = getHackRefId(value)
          hackMap.delete(hackRefId)   // 释放内存，避免内存泄漏
        }
      })
    return hackQuery
  },
}
