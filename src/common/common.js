// 设备类型-------------------------------------------------------------------------------------------
const scenesA = { weatherScenes: [{ type: 'sunny', index: 0, title: '默认场景' }] }
const scenesRG = { lightScenes: [{ type: 'red', index: 0, title: '红灯' }, { type: 'green', index: 1, title: '绿灯' }] }
const scenesW = {
  weatherScenes: [
    { type: 'sunny', index: 0, title: '默认场景' },
    { type: 'fog', index: 1, title: '浓雾场景' },
    { type: 'rain-snow', index: 2, title: '雨雪天气' }],
  roadScenes: [
    { type: 'construction', index: 3, title: '道路施工' },
    { type: 'trafficAccident', index: 4, title: '交通事故' }],
  customizeScenes: [
    { type: 'customize1', index: 5, title: '自定义场景1' },
    { type: 'customize2', index: 6, title: '自定义场景1' }]
}

export const deviceTypeArr = Object.freeze([
  { text: 'ELF-A', val: 'ELF-A', scenes: scenesA },
  { text: 'ELF-T1-W', val: 'ELF-T1-W', scenes: scenesW },
  { text: 'ELF-T1-RG', val: 'ELF-T1-RG', scenes: scenesRG },
  { text: 'ELF-T2-W', val: 'ELF-T2-W', scenes: scenesW },
  { text: 'ELF-T2-RG', val: 'ELF-T2-RG', scenes: scenesRG }
])

export const lightControl = Object.freeze([{ val: 0, text: '自动' }, { val: 1, text: '手动' }])

export const stateOrient = Object.freeze([
  { val: 0, text: '横屏向右' },
  { val: 1, text: '竖屏向上' },
  { val: 8, text: '横屏向左' },
  { val: 9, text: '竖屏向下' }
])

export const scenes = Object.freeze([
  { val: 0, text: '默认场景' },
  { val: 1, text: '浓雾天气' },
  { val: 2, text: '雨雪天气' },
  { val: 3, text: '道路施工' },
  { val: 4, text: '交通事故' },
  { val: 5, text: '红灯' },
  { val: 6, text: '绿灯' }
])

const weatherScenes = Object.freeze([
  { type: 'sunny', title: '默认场景', des: '适用于一般情况下的播放列表' },
  { type: 'cloudy', title: '多云天气', des: '适用于一般情况下的播放列表' },
  { type: 'shade', title: '阴天天气', des: '适用于一般情况下的播放列表' },
  { type: 'rain', title: '雨天天气', des: '适用于一般情况下的播放列表' },
  { type: 'thundershower', title: '雷阵雨天气', des: '适用于一般情况下的播放列表' },
  { type: 'thundershower-hail', title: '雷阵雨冰雹天气', des: '适用于一般情况下的播放列表' },
  { type: 'rain-hail', title: '雨加冰雹天气', des: '适用于一般情况下的播放列表' },
  { type: 'freezing-rain', title: '冻雨天气', des: '适用于一般情况下的播放列表' },
  { type: 'snow', title: '雪天天气', des: '适用于一般情况下的播放列表' },
  { type: 'rain-snow', title: '雨夹雪天气', des: '适用于雨雪天气下的播放列表' },
  { type: 'fog', title: '浓雾天气', des: '适用于浓雾天气情况下的播放列表' },
  { type: 'heat', title: '高温天气', des: '适用于一般情况下的播放列表' },
  { type: 'cold', title: '低温天气', des: '适用于一般情况下的播放列表' },
  { type: 'gale', title: '大风天气', des: '适用于一般情况下的播放列表' },
  { type: 'hail', title: '冰雹天气', des: '适用于一般情况下的播放列表' },
  { type: 'sandstorm', title: '沙尘暴天气', des: '适用于一般情况下的播放列表' },
  { type: 'haze', title: '雾霾天气', des: '适用于一般情况下的播放列表' },
  { type: 'smoke', title: '浓烟天气', des: '适用于一般情况下的播放列表' },
  { type: 'unknown', title: '未知', des: '适用于一般情况下的播放列表' }
])

const roadScenes = Object.freeze([
  { type: 'construction', title: '道路施工', des: '适用于前方道路施工时' },
  { type: 'trafficAccident', title: '交通事故', des: '适用于前方交通事故时' }
])

const customizeScenes = Object.freeze([
  { type: 'customize1', title: '自定义场景1', des: '用户可根据需要自行配置' },
  { type: 'customize2', title: '自定义场景2', des: '用户可根据需要自行配置' }
])

const lightScenes = Object.freeze([
  { type: 'red', title: '红灯', des: '适用于红灯亮起情况下的播放列表' },
  { type: 'green', title: '绿灯', des: '适用于绿灯亮起情况下的播放列表' }
])

export const playlistType = Object.freeze({
  weatherScenes,
  roadScenes,
  customizeScenes,
  lightScenes
})

export const scenesOptions = Object.freeze({
  A: [
    { value: 0, text: '默认场景' }
  ],
  RG: [
    { value: 0, text: '红灯' },
    { value: 1, text: '绿灯' }
  ],
  W: [
    { value: 0, text: '默认场景' },
    { value: 1, text: '浓雾天气' },
    { value: 2, text: '雨雪天气' },
    { value: 3, text: '道路施工' },
    { value: 4, text: '交通事故' },
    { value: 5, text: '自定义场景1' },
    { value: 6, text: '自定义场景2' }
  ]
})
