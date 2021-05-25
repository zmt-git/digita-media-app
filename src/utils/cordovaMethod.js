/* eslint-disable */
function callBack() { }
/**
 * @description启动页的显示隐藏 设置为true 为隐藏 反之亦然
 * @param {*} val
 */
export function setSplashscreen (val = true) {
  if (val) {
    navigator.splashscreen.hide()
  } else {
    navigator.splashscreen.show()
  }
}

/**
 * @description获取版本信息
 * @param {*} callBck 获取到版本号的回调函数
 * @param {*} that vue的this
 */
export function getAppVersion (callBck = callBack) {
  cordova.getAppVersion.getVersionNumber()
    .then(function (version) {
      callBack(version)
    })
}

// 设置手机的横竖屏方法
export function setOrientation (val = true, callBck = callBack) {
  if (val) {
    // portrait 是竖屏状态
    screen.orientation.lock('portrait')
  } else {
    // landscape 是横屏状态
    screen.orientation.lock('landscape')
  }
  callBack()
}
