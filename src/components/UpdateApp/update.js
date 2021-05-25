// 文件apk下载方法
// 创建文件夹
export function onDownload (_this) {
  try {
    window.resolveLocalFileSystemURL(
      // eslint-disable-next-line no-undef
      cordova.file.externalDataDirectory,
      function (fs) {
        fs.getFile(
          _this.fileName, // 创建的文件名
          { create: true, exclusive: true },
          // create：创建新文件，exclusive:文件已存在时抛出异常
          function (fileEntry) {
            // 创建成功回调下载方法写入文件
            downloadFile(fileEntry, _this)
          },
          function (err) {
            console.log(err)
            // 失败回调
            // 重新读取文件并打开
            fs.getFile(
              _this.fileName,
              { create: false },
              function (fileEntry) {
                // 成功读取文件后调用cordova-plugin-file-opener2插件打开文件
                preview(fileEntry, _this)
              },
              function (err) {
                console.log(err)
                _this.toast('读取文件失败', 'fail')
              }
            )
          }
        )
      },
      function (error) {
        console.log(error)
        _this.Downloaderror()
        _this.toast('进入文件系统失败！', 'fail')
      }
    )
  } catch (e) {
    console.log(e)
    // _this.toast('下载失败', 'fail')
    _this.showProgress = false
  }
}
/**
 * @description 下载方法
 * @param {*} fileEntry
 * @param {*} _this
 */
function downloadFile (fileEntry, _this) {
  // 初始化进度条并显示
  // 此处采用mint-ui的Progress组件
  _this.progress = 0
  _this.showProgress = true
  // 实例化
  // eslint-disable-next-line no-undef
  const fileTransfer = new FileTransfer()
  // 监听下载进度
  fileTransfer.onprogress = function (e) {
    if (e.lengthComputable) {
      const progress = e.loaded / e.total
      // 显示下载进度
      _this.progress = (progress * 100).toFixed(2)
      console.log(_this.progress)
    }
  }
  // 使用fileTransfer.download开始下载
  fileTransfer.download(
    encodeURI(_this.savePath), // uri网络下载路径
    fileEntry.toURL(), // 文件本地存储路径
    function (entry) {
      // 下载完成执行本地预览
      if (_this.progress > 1 || _this.progress === 1) {
        _this.loading = false
        _this.showProgress = false
        _this.show = false
        entry.file(data => {
          preview(fileEntry, _this)
          // 此处data.type可以直接得到文件的MIME-TYPE类型
        })
      }
    },
    function (error) {
      console.log(error)
      _this.Downloaderror()
      _this.toast('下载失败！', 'fail')
    }
  )
}
/**
 *@description 打开apk方法
 */
function preview (fileEntry, _this) {
  // 调用cordova-plugin-file-opener2插件实现用第三方app打开文件
  // eslint-disable-next-line no-undef
  cordova.plugins.fileOpener2.showOpenWithDialog(
    // 此处必须填写cdvfile://地址，不然android7.0+会报文件权限错误
    fileEntry.toInternalURL(), // 文件本地地址转cdvfile://地址
    'application/vnd.android.package-archive', // 文件类型
    function onSuccess (data) {
      console.log('成功预览:' + data)
    },
    function onError (error) {
      console.log(error)
      _this.Downloaderror()
      _this.toast(
        // eslint-disable-next-line no-undef
        '出错！请在' + cordova.file.externalDataDirectory + '目录下查看', 'text')
    }
  )
}
