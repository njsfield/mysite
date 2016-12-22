module.exports = (categoryname) => {
  let color;
  switch (categoryname.toLowerCase()) {
    case 'css' : { color = 'blue'; break; }
    case 'design' : { color = 'pink'; break; }
    case 'javascript' : { color = 'red'; break; }
    case 'portfolio' : { color = 'green'; break; }
    case 'databases' : { color = 'grey'; break; }
    case 'testing' : { color = 'purple'; break; }
    case 'html' : { color = 'orange'; break; }
    case 'personal' : { color = 'light-blue'; break; }
  }
  return color;
};
