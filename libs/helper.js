export function setColorTheme (theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
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
