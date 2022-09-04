const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();
const path = require('path')
const pug = require('pug')
const fs = require('fs')

const outPath = path.join(__dirname, 'out')
const viewsPath = path.join(__dirname, 'views')
const configPath = path.join(__dirname, 'config')
const assetsPath = path.join(__dirname, 'assets')
const markdownPath = path.join(__dirname, 'markdown')

if (fs.existsSync(outPath))
  fs.rmSync(outPath, {
    recursive: true
  })

fs.mkdirSync(path.join(outPath, 'assets'), {
  recursive: true
})

fs.readdirSync(assetsPath).forEach((file) => {
  fs.copyFileSync(path.join(assetsPath, file), path.join(outPath, 'assets', file))
})

const context = { markdown: [] }

fs.readdirSync(configPath).forEach((file) => {
  context[file.slice(0, -5)] = require(path.join(configPath, file))
})
fs.readdirSync(markdownPath).forEach((file) => {
  context.markdown[file.slice(0, -3)] = md.render(fs.readFileSync(path.join(markdownPath, file)).toString())
})

fs.readdirSync(viewsPath, { withFileTypes: true }).filter(a => a.isFile()).forEach((view) => {
  fs.writeFileSync(path.join(outPath, view.name.slice(0, -3) + 'html'), pug.renderFile(path.join(viewsPath, view.name), context))
})
