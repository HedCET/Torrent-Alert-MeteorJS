// ==UserScript==
// @author       linto.cet@gmail.com
// @description  ww8
// @match        *://localhost:3000/*
// @match        *://ww8.herokuapp.com/*
// @name         ww8
// @namespace    *://localhost:3000/*
// @require      http://momentjs.com/downloads/moment.min.js
// @require      http://underscorejs.org/underscore-min.js
// @version      1.0.0
// ==/UserScript==

'use strict';

var tamper_monkey = { origin: null, window: null },
  keyword_normalizer = function(keyword) {
    return keyword.replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/\s+/g, ' ').trim();
  };

tamper_monkey_check = function(origin) {
  console.log('tamper_monkey_check', origin);

  tamper_monkey.origin = origin;
  tamper_monkey.window = window.open(tamper_monkey.origin, 'worker');

  window.addEventListener('message', function(e) {
    if (e.origin != tamper_monkey.origin) {
      return;
    } else {
      tamper_monkey_update(e.data);
    }
  }, false);
};

tamper_monkey_run = function(input) {
  console.log('tamper_monkey_run', input);

  if (tamper_monkey.origin && Meteor.user()._id == 'ADMIN') {
    Meteor.subscribe('worker', input);

    _worker.find(input.query, input.option).observe({
      addedAt: function(row) {
        console.log('tamper_monkey_run', row);
        tamper_monkey.window.postMessage(row, tamper_monkey.origin);
      },
    });
  }
};

tamper_monkey_update = function(input) {
  console.log('tamper_monkey_update', input);

  Meteor.call('update_worker', input, function(error, res) {
    if (error) {
      console.log('tamper_monkey_update', 'error', error);
    }
  });
};
