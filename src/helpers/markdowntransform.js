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
  sanitize: false,
  smartLists: true,
  smartypants: true
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

/* Inline Code */
renderer.codespan = (code) => {
  return `<code class="code__inline">${code}</code>`;
};

/* Link */
renderer.link = (href, title, text) => {
  return `<a class="a" href="${href}">${text}</a>`;
};

/* Heading */
renderer.heading = (text, level) => {
  const align = /^{.+}$/.test(text) ? `h${level}--center` : '';
  text = align ? text.split('').slice(1, -1).join('') : text;
  return `<h${level} class="h${level} ${align}">${text}</h${level}>`;
};

/* List */
renderer.list = (body, boolean) => {
  return `<${boolean ? 'ol' : 'ul'} class="${boolean ? 'ol' : 'ul'}">${body}</${boolean ? 'ol' : 'ul'}>`;
};
/* List Item */
renderer.listitem = (text) => {
  return `<li class="li">${text}</li>`;
};

/* Table */
renderer.table = (thead, tbody) => {
  return `<table class="table">
    <thead class="table__thead">${thead}</thead>
    <tbody class="table__tbody">${tbody}</tbody>
    </table>`;
};

/* Table Row */
renderer.tablerow = (tr) => {
  return `<tr class="table__tr">${tr}</tr>`;
};

/* Table Row */
renderer.tablecell = (td, flags) => {
  const type = flags.header ? 'th' : 'td';
  const align = flags.align || 'left';
  const tdAlignClass = flags.header ? '' : `table__td--${align}`;
  return `<${type} class="table__${type} ${tdAlignClass}">${td}</${type}>`;
};

/* Block Quote */
renderer.blockquote = (quote) => {
  return `<div class="blockquote">${quote}</blockquote>`;
};

module.exports = (text) => marked(text, {renderer: renderer});
