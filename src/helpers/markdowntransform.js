const marked = require('marked');
const renderer = new marked.Renderer();
const highlightjs = require('highlight.js');

// Helper function to extract mod classes (e.g '-center-'), returning parsed text and classes in object
const classExtract = (className, text) => {
  let mods = text.match(/-\w+-/g);
  if (mods) mods.forEach(m => { text = text.replace(m, ''); });
  let modClasses = mods ? `${mods.map(m => className + '--' + m.slice(1, -1)).join(' ')}` : '';
  return {text: text, classes: modClasses};
};

/* Prefix for highlighted code classes */
highlightjs.configure({
  classPrefix: 'code--'
});

/* Init */
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
  let parsed = classExtract('p', text);
  return `<p class="p ${parsed.classes}">${parsed.text}</p>`;
};

/* Code */
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language));
  // Highlight only if the language is valid.
  const highlighted = validLang ? highlightjs.highlight(language, code).value : code;
  // Render the highlighted code with `hljs` class.
  let parsed = classExtract('code', highlighted);
  return `<pre class="code ${parsed.classes}"><code class="code__${language}">${parsed.text}</code></pre>`;
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
  let parsed = classExtract(`h${level}`, text);
  return `<h${level} class="h${level} ${parsed.classes}">${parsed.text}</h${level}>`;
};

/* List */
renderer.list = (body, boolean) => {
  let listType = boolean ? 'ol' : 'ul';
  let parsed = classExtract(listType, body);
  return `<${listType} class="${listType} ${parsed.classes}">${parsed.text}</${listType}>`;
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

/* Image */
renderer.image = (href, title, text) => {
  let parsed = classExtract('img', text);
  return `<img class="img ${parsed.classes}" src="${href}" alt="${parsed.text}" title="${parsed.text}">`;
};

module.exports = (text) => marked(text, {renderer: renderer});
