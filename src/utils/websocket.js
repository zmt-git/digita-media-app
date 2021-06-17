import { getToken } from '@/utils/auth'
import eventBus from '@/utils/eventBus'
import store from '@/store/index'

const heartTime = 30 * 1000

const reconnectTime = 3 * 1000

const reconnectMaxNum = 10

let websocketInstance = {}

let options = {}

let reconnectNum = 0

let reconnectTimer = null

let heartTimer = null

function getUrl (optionsObj) {
  let url = ''
  if (optionsObj && optionsObj.url) {
    url = optionsObj.url
  } else {
    url = window.URLS.VUE_APP_BASE_WS
    options.url = window.URLS.VUE_APP_BASE_WS
  }
  return `${url + getToken()}?token=${getToken()}&userId=${store.getters.user.userId}`
}

export function reconnect () {
  if (reconnectNum > reconnectMaxNum) {
    console.log('websocket重连失败')
    reconnectTimer && clearTimeout(reconnectTimer)
    return
  }
  initWebSocket(options)

  reconnectNum++

  console.log('重连:' + reconnectNum + '次')
}

function keepAliveHeart () {
  heartTimer = setTimeout(() => {
    console.log('发送心跳')
    send(JSON.stringify({ data: { code: 'heart' } }))
    heartTimer && clearTimeout(heartTimer)
    keepAliveHeart()
  }, heartTime)
}

export function onOpen () {
  console.log('WebSocket onOpen')
  reconnectTimer && clearTimeout(reconnectTimer)
  keepAliveHeart()
}

export function onMessage (agentData) {
  console.log(agentData.data)
  try {
    const jsonData = agentData.data

    const content = JSON.parse(jsonData)

    eventBus.$emit('updateDeviceStatus', content)
  } catch (e) {
    console.log(e)
  }
}

export function onClose () {
  console.log('WebSocket closed')
  heartTimer && clearTimeout(heartTimer)
}

export function onError (e) {
  console.log(e)
  reconnectTimer && clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(() => {
    reconnect()
  }, reconnectTime)
}

export async function initWebSocket (optionsObj) {
  if (typeof WebSocket === 'undefined') {
    alert('您的浏览器不支持WebSocket')
    return
  }

  if (Object.keys(store.getters.user).length <= 0) {
    await store.dispatch('getUser')
  }
  console.log('init websocket')

  options = optionsObj || {}

  const url = getUrl(options)

  websocketInstance = new WebSocket(url)

  websocketInstance.onopen = onOpen

  websocketInstance.onmessage = onMessage

  websocketInstance.onclose = onClose

  websocketInstance.onerror = onError
}

export function send (msg) {
  websocketInstance.send(msg)
}

export function close () {
  try {
    websocketInstance.close()
  } catch (e) {
    // console.log(e)
  }
}

// 销毁websocket连接
export function websocketDestroy () {
  eventBus.$off('updateDeviceStatus')
  websocketInstance = {}
}
