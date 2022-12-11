/**
 * @判断是否为JSONstring
 */
export function isJSON(str) {
  if (typeof str === "string") {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
/**
 * @param {data} timestamps 时间戳
 * @returns yyy-MM-dd mm:HH:ss
 */
export function timestampToTime(timestamp, type) {
  if (!timestamp) {
    return "";
  }
  if (timestamp.length === 10) {
    timestamp = timestamp * 1000;
  }
  var date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + "-";
  const M = (date.getMonth() + 1).toString().padStart(2, "0") + "-";
  const D = date.getDate().toString().padStart(2, "0") + " ";
  const h = date.getHours().toString().padStart(2, "0") + ":";
  let m = date.getMinutes().toString().padStart(2, "0") + ":";
  const s = date.getSeconds().toString().padStart(2, "0");
  if (type === undefined) {
    return Y + M + D + h + m + s;
  } else if (type.toLowerCase() === "hh:mm") {
    m = m.slice(0, -1);
    return h + m;
  } else if (type.toLowerCase() === "hh:mm:ss") {
    return h + m + s;
  } else {
    return Y + M + D + h + m + s;
  }
}
/**
 * @param {data} timestamps 时间戳
 * @returns yyy-MM-dd mm:HH:ss
 */
export function timeTotimestamp(time) {
  const timestamp = new Date(time).getTime();
  return timestamp;
}

export function secondFormat(second, num = 2) {
  if (typeof second !== "number") return "00:00";
  let hh =
    parseInt(second / 3600) >= 10
      ? parseInt(second / 3600) + ":"
      : "0" + parseInt(second / 3600) + ":";
  const mm =
    parseInt((second % 3600) / 60) >= 10
      ? parseInt((second % 3600) / 60) + ":"
      : "0" + parseInt((second % 3600) / 60) + ":";
  const ss =
    parseInt((second % 3600) % 60) >= 10
      ? parseInt((second % 3600) % 60)
      : "0" + parseInt((second % 3600) % 60);
  if (hh === "00:" && num === 2) {
    hh = "";
  }
  return hh + mm + ss;
}
/**
 * @param {*} time 'hh:mm:ss'
 */
export function formatTosecond(time) {
  const arr = time.split(":");
  const hh = parseInt(arr[0]) * 3600;
  const mm = parseInt(arr[1]) * 60;
  const ss = parseInt(arr[2]);
  return hh + mm + ss;
}

export function getTimes(
  timestamp,
  type = ["YY", "MM", "DD", "hh", "mm", "ss"]
) {
  var date = timestamp;
  const obj = {};
  obj.YY = date.getFullYear();
  obj.MM = (date.getMonth() + 1).toString().padStart(2, "0");
  obj.DD = date.getDate().toString().padStart(2, "0");
  obj.hh = date.getHours().toString().padStart(2, "0");
  obj.mm = date.getMinutes().toString().padStart(2, "0");
  obj.ss = date.getSeconds().toString().padStart(2, "0");
  let date1 = "";
  type.forEach((item) => {
    date1 += obj[item].toString();
  });
  return date1;
}
