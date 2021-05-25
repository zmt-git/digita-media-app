import store from '@/store/index'
import { isJSON } from '@/utils/format'
import { getToken } from '@/utils/auth'
import eventBus from '@/utils/eventBus'
let websock = {}
export async function initWebSocket (moudel = 'devStatus') {
  if (!getToken()) {
    store.dispatch('Logout')
    return
  }
  if (Object.keys(store.getters.user).length <= 0) {
    await store.dispatch('getUser')
  }
  websock[moudel] = new WebSocket(window.URLS.VUE_APP_BASE_WS + `${getToken()}?token=${getToken()}&userId=${store.getters.user.userId}`)
  websock[moudel].onopen = websocketonopen
  websock[moudel].onerror = websocketonerror
  websock[moudel].onmessage = websocketonmessage
  websock[moudel].onclose = websocketclose
}
// 统一处理接收返回的数据，提取sid图层信息
function websocketonmessage (agentData) {
  if (!isJSON(agentData.data)) return
  // console.log(agentData.data)
  eventBus.$emit('updateDeviceStatus', JSON.parse(agentData.data))
}

function websocketonopen () {
  console.log('websocket连接成功')
}

function websocketonerror (e) {
  console.log('websocket连接发生错误')
}

function websocketclose (e) {
  console.log('websocket连接关闭')
}

// 销毁websocket连接
export function websocketDestory () {
  if (!websock) return
  const arr = Object.keys(websock)
  arr.forEach(item => {
    eventBus.$off(item)
  })
  websock = {}
}
