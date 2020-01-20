/// <reference path="../typing/index.d.ts" />
import './mockWx'
import HackRouter from '../src/HackRouter'

beforeEach(() => {
  HackRouter.plugins.clear()
})

describe('call the api correctly', () => {
  it('navigate', () => {
    const spy = jest.spyOn(wx, 'navigateTo')
    HackRouter.goTo('./')
    expect(spy).toBeCalled()
  })
  it('redirect', () => {
    const spy = jest.spyOn(wx, 'redirectTo')
    HackRouter.redirectTo('./')
    expect(spy).toBeCalled()
  })
  it('reLaunch', () => {
    const spy = jest.spyOn(wx, 'reLaunch')
    HackRouter.reLaunch('./')
    expect(spy).toBeCalled()
  })
  it('switch Tab', () => {
    const spy = jest.spyOn(wx, 'switchTab')
    HackRouter.switchTab('./')
    expect(spy).toBeCalled()
  })
  it('back', () => {
    const spy = jest.spyOn(wx, 'navigateBack')
    HackRouter.goBack()
    expect(spy).toBeCalled()
  })
})

describe('plugin', () => {
  it('plugin will be called', () => {
    const plugin = jest.fn()
    HackRouter.plugins.add(plugin)
    HackRouter.goTo('./')
    expect(plugin).toBeCalled()
  })
  it('plugin call cancel link', () => {
    const spy = jest.spyOn(wx, 'navigateTo')
    HackRouter.plugins.add(config => {
      config.type = 'none'
    })
    HackRouter.goTo('./')
    expect(spy).not.toBeCalled()
  })
})
