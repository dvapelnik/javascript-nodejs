var Modal = require('client/head/modal');
var courseForm = require('../templates/course-form.jade');
var clientRender = require('client/clientRender');
var newsletter = require('newsletter/client');

exports.init = function() {
  initList();

  var form = document.querySelector('[data-newsletter-subscribe-form]');

  form.onsubmit = function(event) {
    event.preventDefault();
    newsletter.submitSubscribeForm(form);
  };

  var link = document.querySelector('[data-nodejs-screencast-top-subscribe]');

  link.onclick = function(event) {
    var modal = new Modal();
    modal.setContent(clientRender(courseForm));

    var form = modal.elem.querySelector('form');
    form.setAttribute('data-newsletter-subscribe-form', 'nodejs-top');
    form.onsubmit = function(event) {
      event.preventDefault();
      newsletter.submitSubscribeForm(form, function() {
        modal.remove();
      });
    };

    event.preventDefault();
  };

};

function initList() {
  var lis = document.querySelectorAll('li[data-mnemo]');

  for (var i = 0; i < lis.length; i++) {
    var li = lis[i];
    var mnemo = li.getAttribute('data-mnemo');

    li.insertAdjacentHTML(
      'beforeEnd',

      '<div class="lessons-list__download">' +
      '<div class="lessons-list__popup">' +
      '<ul class="lessons-list__popup-list">' +
      '<li class="lessons-list__popup-item">' +
      '<a data-track-outbound href="/nodejs-screencast/nodejs-mp4-low/' +
      mnemo + '.mp4">Компактный размер</a>' +
      '</li>' +

      '<li class="lessons-list__popup-item">' +
      '<a data-track-outbound href="/nodejs-screencast/nodejs-mp4/' +
      mnemo + '.mp4">Высокое качество</a>' +
      '</li>' +
      '</ul>' +
      '</div>' +
      '</div>'
    );
  }
}


