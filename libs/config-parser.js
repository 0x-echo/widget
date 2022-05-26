import qs from 'query-string'

const booleanFields = [
  'has-h-padding',
  'h-v-padding',
  'show-comment-dislike',
  'support-mumbai'
]

export default function () {
  const url = document.location.href
  const query = qs.parse(url.split('?')[1] || '')
  if (query.modules) {
    query.modules = query.modules.split(',')
  }
  booleanFields.forEach(f => {
    if (query[f] && query[f] === 'true') {
      query[f] = true
    } else {
      query[f] = false
    }
    const underlined = f.replace(/-/g, '_')
    query[underlined] = query[f]
  })
  return query
}

