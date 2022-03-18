export function isUpdateApp (currentVersion, latestVersion) {
  try {
    const current = currentVersion.split('.')
    const last = latestVersion.split('.')
    if (current.length === last.length && last.length !== 0) {
      let result = false
      for (let i = 0; i < last.length; i++) {
        if (parseInt(last[i]) > parseInt(current[i])) {
          result = true
          break
        }
      }
      return result
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}
