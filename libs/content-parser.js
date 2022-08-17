// https://linkify.js.org/docs/options.html
import linkifyHtml from 'linkify-html'
import xss from 'xss'
import cropUrl from 'crop-url'
import markdown from 'markdown-it/dist/markdown-it'
// import hljs from 'highlight.js/lib/common' // styels locates in @/styles/highlight/
import hljs from '@0xecho/highlight.js/es/common'
import emoji from 'markdown-it-emoji'
import iterator from 'markdown-it-for-inline'

const CODE_BLOCK_REG = /```[a-z]*\n[\s\S]*?\n```/g

const md = markdown({
	html: true,
	linkify: true,
	breaks: true,
	highlight: function (str, lang, c) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code class="code__no-lang">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})
//	.disable(['heading'])

md.use(emoji)

md.normalizeLink = function (url, a) {
	return url
}

md.validateLink = function (url,b) {
	return true
}

// https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
md.use(iterator, 'url_new_win', 'link_open', function (tokens, idx) {
	const attrs = [
		['target', '_blank'],
		['ref', 'noopener']
	]
	attrs.forEach(one => {
		const [k, v] = one
		var aIndex = tokens[idx].attrIndex(k)

		if (aIndex < 0) {
			tokens[idx].attrPush(one)
		} else {
			tokens[idx].attrs[aIndex][1] = v
		}
	})
	
})

export function parseContent(str, isRender = true) {
	if (!str) {
		return ''
	}

	// trim
	str = str.trim()

	// ignore code block
	const codeBlockMap = {}
	let codeBlockIndex = 0
	str = str.replace(CODE_BLOCK_REG, function (a, b) {
		const key = `$$$${codeBlockIndex}$$$`
		codeBlockMap[key] = a
		codeBlockIndex++
		return key
	})

	// ignore blockquote tag, or they will be escape by xss
	str = str.split('\n').map(line => {
		if (/^\>>>/.test(line)) {
			line = line.replace(/^\>>>/g, '__BLOCKQUOTE____BLOCKQUOTE____BLOCKQUOTE__')
		}
		if (/^\>>/.test(line)) {
			line = line.replace(/^\>>/g, '__BLOCKQUOTE____BLOCKQUOTE__')
		}
		if (/^\>/.test(line)) {
			line = line.replace(/^\>/g, '__BLOCKQUOTE__')
		}
		return line
	}).join('\n')

	str = xss(str, {
		css: false,
		whiteList: {
			sup: [],
			sub: []
		}, // empty, means filter out all tags
		stripIgnoreTag: true, // filter out all HTML not in the whitelist
		stripIgnoreTagBody: [ 'script' ] // the script tag is a special case, we need
	})

	str = str.replace(/__BLOCKQUOTE__/g, '>')
	for (const key in codeBlockMap) {
		str = str.replace(key, codeBlockMap[key])
		delete codeBlockMap[key]
	}

	if (isRender) {
		try {
			str = md.render(str)
		} catch (e) {
			console.log(e)
		}
		
		// str = linkifyHtml(str, {
    //   nl2br: false,
    //   format: (value, type) => {
    //     if (type === 'url' && value.length > 50) {
    //       value = cropUrl(value, 50)
    //     }
    //     return value;
    //   },
    //   rel: 'noopener',
		// 	target: '_blank',
    //   attributes: {
    //     title: 'DYOR on the external url.'
    //   }
		// })

		str = str.trim().replace(/<br>$/, '')
	}

  return str
}
