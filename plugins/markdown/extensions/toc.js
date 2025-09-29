/**
 * marked 插件：支持 [TOC] 语法，自动生成嵌套目录
 */
export function markedToc() {
  let headings = []

  let firstToken = true

  return {
    walkTokens(token) {
      if (firstToken) {
        headings = []
        firstToken = false
      }
      if (token.type === 'heading') {
        const text = token.text || ''
        const depth = token.depth || 1
        const index = headings.length
        headings.push({ text, depth, index })
      }
    },
    extensions: [
      {
        name: 'toc',
        level: 'block',
        start(src) {
          // 只匹配独立一行的 [TOC]，避免误伤
          const match = src.match(/^\s*\[TOC\]\s*$/m)
          return match ? match.index : undefined
        },
        tokenizer(src) {
          const match = /^\[TOC\]/.exec(src)
          if (match) {
            return { type: 'toc', raw: match[0] }
          }
        },
        renderer() {
          if (!headings.length) return ''
          let html =
            '<nav class="markdown-toc"><ul class="toc-ul toc-level-1">'
          let lastDepth = 1
          headings.forEach(({ text, depth, index }) => {
            if (depth > lastDepth) {
              for (let i = lastDepth + 1; i <= depth; i++) {
                html += `<ul class="toc-ul toc-level-${i}">`
              }
            } else if (depth < lastDepth) {
              for (let i = lastDepth; i > depth; i--) {
                html += '</ul>'
              }
            }
            html += `<li class="toc-li toc-level-${depth}"><a href="#${index}">${text}</a></li>`
            lastDepth = depth
          })

          for (let i = lastDepth; i > 1; i--) {
            html += '</ul>'
          }

          html += '</ul></nav>'

          firstToken = true
          return html
        },
      },
    ],
  }
}
