(function () {
  var imageBtn = document.querySelector('.edit__image-button');
  var bodyElt = document.querySelector('body');
  var XML = XMLHttpRequest;

  // Display imageDiv

  // Make request
  function fetchImages (cb) {
    var xhr = new XML();
    xhr.addEventListener('load', function (res) {
      cb(JSON.parse(res.target.responseText).images);
    });
    xhr.open('get', '/images');
    xhr.send();
  }

  // Image Button
  imageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    fetchImages(function (data) {
      console.log(data);
    });
  });
})();
