export function isUpdateApp(currentVersion, latestVersion) {
  if (currentVersion === latestVersion) return false;
  try {
    const current = currentVersion.split(".");
    const last = latestVersion.split(".");
    if (current.length === last.length && last.length !== 0) {
      let result = false;
      for (let i = 0; i < last.length; i++) {
        if (parseInt(current[i]) > parseInt(last[i])) {
          result = false;
          break;
        }
        if (parseInt(current[i]) < parseInt(last[i])) {
          result = true;
          break;
        }
      }
      return result;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
