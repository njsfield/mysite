module.exports = (marked) => {
  return marked.replace(/[*#\-\[\]\(\)]/g, '');
};
