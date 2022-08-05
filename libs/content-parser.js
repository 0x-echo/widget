// https://linkify.js.org/docs/options.html
import linkifyHtml from 'linkify-html'
import xss from 'xss'
import cropUrl from 'crop-url'

export function parseContent(str, isRender = true) {
	if (!str) {
		return ''
	}

	// trim
	str = str.trim()

	str = xss(str, {
		whiteList: {}, // empty, means filter out all tags
		stripIgnoreTag: true, // filter out all HTML not in the whitelist
		stripIgnoreTagBody: [ 'script' ] // the script tag is a special case, we need
	})

	if (isRender) {
		// str = str.replace(/\n/g, '<br>')

		return linkifyHtml(str, {
      nl2br: true,
      format: (value, type) => {
        if (type === 'url' && value.length > 50) {
          value = cropUrl(value, 50)
        }
        return value;
      },
      rel: 'noopener',
			target: '_blank',
      attributes: {
        title: 'DYOR on the external url.'
      }
		})
	}

  return str
}
