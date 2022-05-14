import qs from 'query-string'

export default function () {
  const url = document.location.href
  const query = qs.parse(url.split('?')[1] || '')
  if (query.modules) {
    query.modules = query.modules.split(',')
  }
  return query
}

