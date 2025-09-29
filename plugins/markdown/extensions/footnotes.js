/**
 * A marked extension to support footnotes syntax.
 * Syntax:
 *  This is a footnote reference[^1][^2].
 *
 *  [^1]: .....
 *  [^2]: .....
 */

const fnMap = new Map()

export function markedFootnotes() {
  return {
    extensions: [
      {
        name: 'footnoteDef',
        level: 'block',
        start(src) {
          fnMap.clear()
          return src.match(/^\[\^/)?.index
        },
        tokenizer(src) {
          const match = src.match(/^\[\^(.*)\]:(.*)/)
          if (match) {
            const [raw, fnId, text] = match
            const index = fnMap.size + 1
            fnMap.set(fnId, { index, text })
            return { type: 'footnoteDef', raw, fnId, index, text }
          }
          return undefined
        },
        renderer(token) {
          const { index, text, fnId } = token
          const fnInner = `
                <code>${index}.</code>
                <span>${text}</span>
                <a id="fnDef-${fnId}" href="#fnRef-${fnId}" class='footnote-link'>\u21A9\uFE0E</a>
                <br>`
          if (index === 1) {
            return `
            <p class="footnotes">${fnInner}`
          }
          if (index === fnMap.size) {
            return `${fnInner}</p>`
          }
          return fnInner
        },
      },
      {
        name: 'footnoteRef',
        level: 'inline',
        start(src) {
          return src.match(/\[\^/)?.index
        },
        tokenizer(src) {
          const match = src.match(/^\[\^(.*?)\]/)
          if (match) {
            const [raw, fnId] = match
            if (fnMap.has(fnId)) {
              return { type: 'footnoteRef', raw, fnId }
            }
          }
        },
        renderer(token) {
          const { fnId } = token
          const { index } = fnMap.get(fnId)
          return `<sup class="footnote">
                  <a href="#fnDef-${fnId}" id="fnRef-${fnId}" class='footnote-link'>[${index}]</a>
                </sup>`
        },
      },
    ],
  }
}
