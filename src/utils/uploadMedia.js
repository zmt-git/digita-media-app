import { getToken } from "./auth";
import { mediaSaveUrl } from "../api/media/uploader";
/* eslint-disable */
// 上传插件对象
let fileTransfer = {}
// 上传服务器地址
let uri = process.env.VUE_APP_BASE_URL + mediaSaveUrl
/**
 * @description上传媒体方法
 * @param {*} _this vue对象this
 */
export default function uploadMedia(_this) {
  navigator.camera.getPicture(
  (imageData) => {
    console.log(imageData)
    uploadImage(imageData, _this)
  },
  (err) => {
    console.log(err)
  },
  {
    // 配置
    destinationType: Camera.DestinationType.FILE_URI, // 图片的src路径
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // 相册中选取
    mediaType: Camera.MediaType.ALLMEDIA, //video和picture
    allowEdit: true // 允许编辑
  })
}

/**
 * @description上传方法配置参数
 * @param {*} fileURL 文件路径
 * @param {*} _this vue示例对象this
 */
function uploadImage(fileURL, _this) {
  // 上传插件对象
  fileTransfer = new FileTransfer()
  // 上传文件配置
  var options = new FileUploadOptions()
　//对应后台的字段
  options.fileKey = 'media'
  // 时间戳 加 文件类型
  options.fileName = new Date().getTime() + fileURL.substr(fileURL.lastIndexOf('.'))
  // 上传参数
  options.params = {
    token: getToken
  }
  // 标头
  options.headers = {
    token: getToken
  }

  // 读取文件信息
  let uploadItem = {
    options: options,
    file: fileURL,
    progress: 0,
    oldSize: 0,
    length: '',
    mediaType: fileURL.substr(fileURL.lastIndexOf('.'))
  }
  // 获取文件信息 设置
  getPhoto(fileURL, uploadItem)

  // 页面显示对象数组添加
  _this.updataLists.push(options)

  // 上传方法
  upload(fileURL, options, uploadItem, _this)
  
  // 监听上传进度
  processF (uploadItem, _this)
}

/**
 *@description读取文件的大小
 * @param {*} imageUri 文件路径
 * @param {*} uploadItem vue上传进度文件显示对象
 */
function getPhoto (imageUri, uploadItem) {
  window.resolveLocalFileSystemURI(
    imageUri,
    function (fileEntry) {
      fileEntry.file(
        // 读取成功
        fileObj => {
          uploadItem.oldSize = fileObj.size
          alert(fileObj)
        },
        // 读取失败
        err => {
          console.log(err)
          uploadItem.oldSize = '读取中...'
          // getPhoto(imageUri,uploadItem)
        }
      )
    }
  )
}


/**
 * @description上传方法
 * @param {String} fileURL 上传文件路径
 * @param {Object} options 上传文件配置参数
 * @param {Object} uploadItem vue上传进度文件显示对象
 * @param {this} _this vue对象this
 */
function upload (fileURL, options, uploadItem, _this) {
  fileTransfer.upload(
    fileURL, // 上传文件本地地址
    encodeURI(uri), // 上传地址
    // 成功回调
    (msg)=>{
      console.log('SUCCESS:')
      console.log(msg)
      _this.toast('上传成功', 'success')
      _this.successFn(uploadItem)
    },
    // 失败回调
    (err)=>{
      console.log('ERROR:')
      console.log(err)
      _this.result = []
      _this.toast('上传失败', 'fail')
      _this.errorFn(uploadItem)
    },
    options // 文件配置
  )
}

/**
 *@description进度监听
 * @param {*} uploadItem vue上传进度文件显示对象
 * @param {*} _this vue对象this
 */
function processF (uploadItem, _this) {
  // 监听下载进度
  fileTransfer.onprogress = function (e) {
    if (e.lengthComputable) {
      const progress = e.loaded / e.total
      // 显示下载进度
      uploadItem.progress = (progress * 100).toFixed(2)
      uploadItem.progressText = (progress * 100).toFixed(2) + '%'
      _this.progressFn(uploadItem)
    }
  }
}