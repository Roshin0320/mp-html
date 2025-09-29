/**
 * @fileoverview markdown 插件
 * Include marked (https://github.com/markedjs/marked)
 * Include github-markdown-css (https://github.com/sindresorhus/github-markdown-css)
 */
// const marked = require('./marked.min')
// import { marked } from "./marked.umd'
import { marked } from './marked.esm'
import { markedAlert } from './extensions/alert'
import { markedMarkup } from './extensions/markup'
import { markedToc } from './extensions/toc'
import { markedFootnotes } from './extensions/footnotes'
// import { marked } from 'marked'
let index = 0
marked.use(markedAlert())
marked.use(markedMarkup())
marked.use(markedToc())
marked.use(markedFootnotes())

function Markdown (vm) {
  this.vm = vm
  vm._ids = {}
}

Markdown.prototype.onUpdate = function (content) {
  if (this.vm.properties.markdown) {
    return marked.parse(content)
  }
}

Markdown.prototype.onParse = function (node, vm) {
  if (vm.options.markdown) {
    // 中文 id 需要转换，否则无法跳转
    if (vm.options.useAnchor && node.attrs && /[\u4e00-\u9fa5]/.test(node.attrs.id)) {
      const id = 't' + index++
      this.vm._ids[node.attrs.id] = id
      node.attrs.id = id
    }
    // if (node.name === 'p' || node.name === 'table' || node.name === 'tr' || node.name === 'th' || node.name === 'td' || node.name === 'blockquote' || node.name === 'pre' || node.name === 'code') {
    //   node.attrs.class = `md-${node.name} ${node.attrs.class || ''}`
    // }
    if (node.name?.trim()) {
      node.attrs.class = `md-${node.name} ${node.attrs.class || ''}`
    }
  }
}

module.exports = Markdown
