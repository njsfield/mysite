const marked = require('marked');
const renderer = new marked.Renderer();
const highlightjs = require('highlight.js');
highlightjs.configure({
  classPrefix: 'code--'
});

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

/* Paragraph */
renderer.paragraph = (text) => {
  return `<p class="p">${text}</p>`;
};

/* Code */
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language));
  // Highlight only if the language is valid.
  const highlighted = validLang ? highlightjs.highlight(language, code).value : code;
  // Render the highlighted code with `hljs` class.
  return `<pre class="code"><code class="code__${language}">${highlighted}</code></pre>`;
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
