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
  smartypants: false
});

renderer.heading = (text, level) => {
  let escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return `<h${level} id="${escapedText}"class="title">${text}</h${level}>`;
};

renderer.list = (body, boolean) => {
  return `<${boolean ? 'ol' : 'ul'} class="${boolean ? 'ol' : 'ul'}">${body}</${boolean ? 'ol' : 'ul'}>`;
};

renderer.listitem = (text) => {
  return `<li class="li">${text}</li>`;
};

module.exports = (text) => marked(text, {renderer: renderer});
