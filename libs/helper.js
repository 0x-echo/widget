export function setColorTheme (theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
}

export function setBodyClass (className, value) {
  if (value) {
    document.body.classList.add(className)
  } else {
    document.body.classList.remove(className)
  }
}

export function setDraft (targetUri, content) {
  try {
    return localStorage.setItem(targetUri, content)
  } catch (e) {}
}

export function getDraft (targetUri) {
  try {
    return localStorage.getItem(targetUri)
  } catch (e) {}
}
