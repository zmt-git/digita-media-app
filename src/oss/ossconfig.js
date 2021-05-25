require('babel-polyfill')
const OSS = require('ali-oss')
const OSSconfig = {
  accessKeyId: 'LTAI4FuPThbyjdJ2gRsHLUvc',
  accessKeySecret: 'YrHmRfmQs9m0mubxhkoZNqdUNzDkES',
  bucket: 'storage-media-1',
  region: 'oss-cn-beijing'
}
export const OSSclient = new OSS(OSSconfig)
export function downloadFile (filename, client = OSSclient) {
  const result = client.signatureUrl(filename)
  return result
}
export const videoFrame = '?x-oss-process=video/snapshot,t_1000,f_png,w_0,h_0,m_fast'
