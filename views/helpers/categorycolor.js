module.exports = (categoryname) => {
  let color;
  switch (categoryname.toLowerCase()) {
    case 'css' : { color = 'blue'; break; }
    case 'design' : { color = 'pink'; break; }
    case 'javascript' : { color = 'red'; break; }
    case 'portfolio' : { color = 'green'; break; }
  }
  return color;
};
