# remax-router
一个 **没什么卵用** 的 [remax](https://github.com/remaxjs/remax) 路由系统

# features
* 小程序多端支持（目前支持 微信、支付宝、钉钉、头条）
* 支持路由插件（可做页面重定向，页面拦截等）
* 支持多种类型页面传参（包括函数）
* 兼容小程序多页面路由系统

# install
```bash
npm i -S remax-router
# or use yarn
yarn add remax-router
```

# get started
## page query
```jsx
// page1.jsx
import React from 'react'
import { View } from 'remax/wechat'
import { createLink } from 'remax-router'
export default () {
  const goToPage2 = createLink('./page2', {
    onSelect(type) {
      console.log('you choose ' + type)
    }
  })
  return (
    <View onClick={goToPage2}>go to page2<View>
  )
}
```
```jsx
// page2.jsx
import { View } from 'remax/wechat'
import { useHackQuery } from 'remax-router'
export default () {
  const query = useHackQuery()
  return (
    <View>
      ['a', 'b', 'c', 'd'].map(item => (
        <View key={item} onClick={() => query.onSelect(item)}>
          {item}
        </View>
      ))
    </View>
  )
}
```

## plugin
```js
import { HackRouter } from 'remax-router'
HackRouter.plugins.add(config => {
  if (!isLogin && /my[A-Z]/.test(config.url))
    config.url = './login' // 若用户打开个人中心页面，没有登录时重定向到登录页面
  if (['./index', './my'].includes(config.url))
    config.type = 'switchTab' // 把 tab bar 页面改为 switchTab 打开方式
  if (!isAuthor) // 403
    config.type = 'none' // 没有权限，不进行页面跳转
})
```

# special
为了处理和解析正确的类型，对路由参数的纯数字字符串做了处理
```
{ n: 1 }
对应 n=1

{ n: '1' }
对应 n='1'
```
其它的字符串不变
```
{ n: 'abc' }
对应 n=abc
```

# remax version
依赖 remax 的 useQuery api，所以需要安装 `1.11.0` 以上的 remax
事实上 [useQuery 的 PR](https://github.com/remaxjs/remax/pull/558) 也是我提的，当时就已经在计划这个包。

# why create it
我们经常遇到这样的场景：在小程序打开一个新的页面，这个页面可能是选个收货地址，选完后返回上一个页面，告诉上一个页面选了什么。

这在 remax 中十分棘手，大部分人可能会选择使用redux等方案，但这种数据一般不需要动用全局方案，它仅仅只在这两个页面用到。全局变量是魔鬼，所以我经常使用 modal 的方案来避免跨页面通讯，但仍然有很多情况不能这样做。

起初，我想解决这个局部跨页面通讯问题，所以做了这个包的 `HackQuery` 部分，但后来我发现可以做更多的事情，比如做路由拦截等，于是有了 `HackRouter` 部分，并取名为 `remax-hack-router`。至于为什么是 hack，因为往其它页面传一个回调函数看起来很 hack。

但不知为何，可能是 hack 这个单词的原因，发布npm时一直503错误，可能被认为是恶意代码，于是改名为 `remax-router`，这也是为什么api为很多都有 Hack 的字样，因为原本就是这么设计的，便保留下来了。

这一切都是在不程序原有的多页面路由基础上封装，并非入侵式的，它兼容小程序原有路由，完全可以逐步引入，按需修改代码。你可以理解为这是小程序路由的增强版。
