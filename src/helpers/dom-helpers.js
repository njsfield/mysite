const toggleClass = (elt, className) => ([...elt.classList].includes(className)) ? removeClass(elt, className) : addClass(elt, className);

// Toggle Disabled
const disableElt = (elt) => { elt.disabled = true; };

// Toggle Disabled
const enableElt = (elt) => { elt.disabled = false; };

// clearHTML
const clearHTML = (elt) => { elt.innerHTML = ''; };

// setHTML
const setHTML = (elt, html) => { elt.innerHTML = html; };

// Display elt
const displayElt = (elt) => { elt.style.display = 'block'; };

// Hide elt
const hideElt = (elt) => { elt.style.display = 'none'; };

// Set className
const addClass = (elt, className) => { elt.classList.add(className); };

// remove className
const removeClass = (elt, className) => { elt.classList.remove(className); };

// set Attribute
const setAttr = (elt, attr, val) => { elt.setAttribute(attr, val); };

// Create raw elt from str
const createRawElt = (str) => {
  let elt = document.createElement('span');
  elt.innerHTML = str;
  return elt.children[0];
};

// Check if hidden
const isHidden = (elt) => elt.style.display === 'none';

// querySelector
const elt = (elt) => document.querySelector(elt);

// on Click
const onClick = (elt, func) => { elt.addEventListener('click', func); };

// for Each Elt
const forEachElt = (elts, func) => { Array.prototype.forEach.call(elts, func); };

// get parent Elt
const parentElt = (elt) => elt.parentElement;

// prevent event default
const stopE = (e) => e.preventDefault();

// stealClass
const stealClass = (elt, className) => {
  forEachElt(parentElt(elt).children, child => removeClass(child, className));
  addClass(elt, className);
};

// set value
const setEltValue = (elt, value) => { elt.value = value; };

// Elt toggle
const toggleElts = (elt1, elt2, bool) => {
  bool ? displayElt(elt1) : displayElt(elt2);
  bool ? hideElt(elt2) : hideElt(elt1);
};

// get Request
const getReq = (path, cb) => {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', (data) => {
    cb(xhr.responseText);
  });
  xhr.open('get', path);
  xhr.send();
};

// post Request
const postReq = (path, payload, cb) => {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', (data) => {
    cb(xhr.responseText);
  });
  xhr.open('post', path);
  xhr.send(payload);
};

// Retrieve File
const retrieveFile = (evt, cb) => {
  let files = evt.target.files;
  let f = files[0];
  let reader = new FileReader();
  reader.onload = (raw) => {
    cb({name: f.name, raw: raw.target.result});
  };
  reader.readAsDataURL(f);
};

module.exports = {
  toggleClass,
  disableElt,
  enableElt,
  clearHTML,
  setHTML,
  displayElt,
  hideElt,
  addClass,
  removeClass,
  setAttr,
  createRawElt,
  isHidden,
  elt,
  onClick,
  forEachElt,
  parentElt,
  stopE,
  stealClass,
  setEltValue,
  toggleElts,
  getReq,
  postReq,
  retrieveFile
};
