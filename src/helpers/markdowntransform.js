const marked = require('marked');
const renderer = new marked.Renderer();

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: (code) => require('highlight.js').highlightAuto(code).value
});

/* Paragraph */
renderer.paragraph = (text) => {
  return `<p class="p">${text}</p>`;
};

/* Code */
renderer.code = (code, lang) => {
  return `<pre class="code"><code class="code__${lang}">${code}</code></pre>`;
};

/* Link */
renderer.link = (href, title, text) => {
  return `<a class="a" href="${href}">${text}</a>`;
};

/* Heading */
renderer.heading = (text, level) => {
  return `<h${level} class="title">${text}</h${level}>`;
};

/* List */
renderer.list = (body, boolean) => {
  return `<${boolean ? 'ol' : 'ul'} class="${boolean ? 'ol' : 'ul'}">${body}</${boolean ? 'ol' : 'ul'}>`;
};

renderer.listitem = (text) => {
  return `<li class="li">${text}</li>`;
};

module.exports = (text) => marked(text, {renderer: renderer});
