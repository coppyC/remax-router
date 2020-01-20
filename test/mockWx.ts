// @ts-ignore
global.wx = <Mp>{
  navigateTo() {},
  navigateBack() {},
  switchTab() {},
  redirectTo() {},
  reLaunch() {},
}

beforeEach(() => {
  Object.keys(wx).forEach(key => {
    (wx as any)[key] = () => {}
  })
})
