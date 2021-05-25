/* eslint-disable */
/**
 * @description扫描二维码方法
 * @param {*} _this vue实列的this
 */
export function erweima (successFn, errorFn) {
  cordova.plugins.barcodeScanner.scan(
    (result) => {
        //扫码成功后执行的回调函数
      successFn(result)
    },
    (error) => {
        //扫码失败执行的回调函数
      console.log(error)
      errorFn(error)
    },
    {
      preferFrontCamera: false, // iOS and Android 设置前置摄像头
      showFlipCameraButton: true, // iOS and Android 显示旋转摄像头按钮
      showTorchButton: true, // iOS and Android 显示打开闪光灯按钮
      torchOn: false, // Android, launch with the torch switched on (if available)打开手电筒
      prompt: "在扫描区域内放置二维码", // Android提示语
      resultDisplayDuration: 500, // Android, display scanned text for X ms //0 suppresses it entirely, default 1500 设置扫码时间的参数
      formats: "QR_CODE,UPC_A", // 二维码格式可设置多种类型
      orientation: "portrait", // Android only (portrait|landscape),//default unset so it rotates with the device在安卓上 landscape 是横屏状态
      disableAnimations: true, // iOS 是否禁止动画
      disableSuccessBeep: true // iOS 禁止成功后提示声音 “滴”
    }
  )
}
