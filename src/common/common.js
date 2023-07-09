// 设备类型-------------------------------------------------------------------------------------------
// 播放列表类型
const scenesOne = {
  weatherScenes: [{ type: "sunny", title: "默认场景", index: 0 }],
};
const scenesTwo = {
  weatherScenes: [
    { type: "sunny", title: "默认场景", index: 0 },
    { type: "fog", title: "浓雾", index: 1 },
    { type: "rain", title: "阵雨", index: 2 },
    { type: "rain-snow", title: "积雪", index: 3 },
    { type: "freeze", title: "结冰", index: 4 },
  ],
  roadScenes: [
    { type: "construction", title: "道路施工", index: 5 },
    { type: "trafficAccident", title: "交通事故", index: 6 },
  ],
  customizeScenes: [
    { type: "customize1", title: "自定义场景1", index: 7 },
    { type: "customize2", title: "自定义场景2", index: 8 },
  ],
};
const scenesThree = scenesTwo;

const scenesFour = {
  weatherScenes: [
    { type: "sunny", title: "默认场景", index: 0 },
    { type: "fog", title: "浓雾", index: 1 },
    { type: "rain", title: "阵雨", index: 2 },
    { type: "rain-snow", title: "积雪", index: 3 },
    { type: "freeze", title: "结冰", index: 4 },
  ],
};
const scenesFive = {
  lightScenes: [
    { type: "red", title: "红灯", index: 0 },
    { type: "green", title: "绿灯", index: 1 },
  ],
};

// 设备类型-------------------------------------------------------------------------------------------
export const deviceTypeArr = Object.freeze([
  // ELF-A
  { val: "ELF-A", text: "ELF-A", scenes: scenesOne, hasSwitch: false },
  // TA
  { val: "TA-W", text: "TA-W", scenes: scenesTwo, hasSwitch: false },
  { val: "TA-RG", text: "TA-RG", scenes: scenesThree, hasSwitch: true },
  { val: "TA-RG-S", text: "TA-RG-S", scenes: scenesFour, hasSwitch: true },
  { val: "TA-RG-C", text: "TA-RG-C", scenes: scenesFive, hasSwitch: false },
  // TB
  { val: "TB-W", text: "TB-W", scenes: scenesTwo, hasSwitch: false },
  { val: "TB-RG", text: "TB-RG", scenes: scenesThree, hasSwitch: true },
  { val: "TB-RG-S", text: "TB-RG-S", scenes: scenesFour, hasSwitch: true },
  { val: "TB-RG-C", text: "TB-RG-C", scenes: scenesFive, hasSwitch: false },
]);

export const orientArr = Object.freeze([
  { val: 0, text: "正向安装" },
  { val: 8, text: "方向安装" },
]);

export const powerArr = Object.freeze([
  { val: 0, text: "电网市电" },
  { val: 1, text: "太阳能蓄电池" },
]);

export const lightControl = Object.freeze([
  { val: 0, text: "自动" },
  { val: 1, text: "手动" },
]);

export const orientProjection = Object.freeze([
  { val: 1, text: "正向" },
  { val: 2, text: "左转" },
  { val: 3, text: "反向" },
  { val: 4, text: "右转" },
]);

export const stateOrient = Object.freeze([
  { val: 0, text: "横屏向右" },
  { val: 1, text: "竖屏向上" },
  { val: 8, text: "横屏向左" },
  { val: 9, text: "竖屏向下" },
]);

export const scenes = Object.freeze([
  { val: 0, text: "默认场景" },
  { val: 1, text: "浓雾天气" },
  { val: 2, text: "雨雪天气" },
  { val: 3, text: "道路施工" },
  { val: 4, text: "交通事故" },
  { val: 5, text: "红灯" },
  { val: 6, text: "绿灯" },
]);

// 天气场景-------------------------------------------------------------------------------------------
const weatherScenes = Object.freeze([
  // ********************
  { type: "sunny", title: "默认场景", des: "适用于路况良好时" },
  // ********************
  { type: "cloudy", title: "多云天气", des: "适用于一般情况下的播放列表" },
  { type: "shade", title: "阴天天气", des: "适用于一般情况下的播放列表" },
  // ********************
  { type: "rain", title: "阵雨", des: "适用于降雨天气道路湿滑时" },
  // ********************
  {
    type: "thundershower",
    title: "雷阵雨天气",
    des: "适用于一般情况下的播放列表",
  },
  {
    type: "thundershower-hail",
    title: "雷阵雨冰雹天气",
    des: "适用于一般情况下的播放列表",
  },
  {
    type: "rain-hail",
    title: "雨加冰雹天气",
    des: "适用于一般情况下的播放列表",
  },
  {
    type: "freezing-rain",
    title: "冻雨天气",
    des: "适用于一般情况下的播放列表",
  },
  { type: "snow", title: "雪天天气", des: "适用于一般情况下的播放列表" },
  // ********************
  { type: "rain-snow", title: "积雪", des: "适用于降雪天气道路积雪时" },
  // ********************
  // ********************
  { type: "fog", title: "浓雾", des: "适用于浓雾及其他行车视线较差时" },
  // ********************
  { type: "heat", title: "高温天气", des: "适用于一般情况下的播放列表" },
  { type: "cold", title: "低温天气", des: "适用于一般情况下的播放列表" },
  { type: "gale", title: "大风天气", des: "适用于一般情况下的播放列表" },
  { type: "hail", title: "冰雹天气", des: "适用于一般情况下的播放列表" },
  { type: "sandstorm", title: "沙尘暴天气", des: "适用于一般情况下的播放列表" },
  { type: "haze", title: "雾霾天气", des: "适用于一般情况下的播放列表" },
  { type: "smoke", title: "浓烟天气", des: "适用于一般情况下的播放列表" },
  { type: "unknown", title: "未知", des: "适用于一般情况下的播放列表" },
  // ********************
  { type: "freeze", title: "结冰", des: "适用于路面发生结冰时" },
  // ********************
]);

// 道路场景-------------------------------------------------------------------------------------------
const roadScenes = Object.freeze([
  { type: "construction", title: "道路施工", des: "适用于前方道路施工时" },
  {
    type: "trafficAccident",
    title: "交通事故",
    des: "适用于前方发生交通事故时",
  },
]);

// 自定义场景-------------------------------------------------------------------------------------------
const customizeScenes = Object.freeze([
  { type: "customize1", title: "自定义场景1", des: "用户可根据需要自行配置" },
  { type: "customize2", title: "自定义场景2", des: "用户可根据需要自行配置" },
]);

// 交通灯场景-------------------------------------------------------------------------------------------
const lightScenes = Object.freeze([
  { type: "red", title: "红灯", des: "适用于红色信号灯开启时" },
  { type: "green", title: "绿灯", des: "适用于绿色信号灯开启时" },
]);

export const playlistType = Object.freeze({
  weatherScenes,
  roadScenes,
  customizeScenes,
  lightScenes,
});
// 切换场景 -------------------------------------------------------------------------------------------
const w = [
  { text: "默认场景", value: 1 },
  { text: "浓雾", value: 2 },
  { text: "降雨", value: 3 },
  { text: "积雪", value: 4 },
  { text: "结冰", value: 5 },
  { text: "道路施工", value: 6 },
  { text: "交通事故", value: 7 },
  { text: "自定义场景1", value: 8 },
  { text: "自定义场景2", value: 9 },
];
const s = [
  { text: "默认场景", value: 1 },
  { text: "浓雾", value: 2 },
  { text: "降雨", value: 3 },
  { text: "积雪", value: 4 },
  { text: "结冰", value: 5 },
];
const c = [
  { text: "红灯", value: 1 },
  { text: "绿灯", value: 2 },
];
export const scenesOptions = Object.freeze({
  "ELF-A": [{ value: 0, text: "默认场景" }],
  "TA-W": w,
  "TA-RG": w,
  "TA-RG-S": s,
  "TA-RG-C": c,
  "TB-W": w,
  "TB-RG": w,
  "TB-RG-S": s,
  "TB-RG-C": c,
});
