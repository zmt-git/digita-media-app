export default function deviceready (callback = cb) {
  return document.addEventListener('deviceready', callback, false)
}
function cb () { }
