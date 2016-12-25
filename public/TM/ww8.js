// ==UserScript==
// @author       linto.cet@gmail.com
// @description  ww8.heroku
// @match        *://localhost:3000/*
// @match        *://ww8.herokuapp.com/*
// @name         ww8.heroku
// @namespace    *://localhost:3000/*
// @require      http://momentjs.com/downloads/moment.min.js
// @require      http://underscorejs.org/underscore-min.js
// @version      1.0.0
// ==/UserScript==

'use strict';

var TM = { observer: null, origin: null, status: { error: 1, received: 1, send: 1 }, window: null },
  keyword_normalizer = function(keyword) {
    return keyword.replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/\s+/g, ' ').trim();
  };

TM_start = function(origin) {
  console.log('TM_start', origin);

  TM.origin = origin;
  TM.window = window.open(TM.origin, 'worker');

  window.addEventListener('message', function(e) {
    if (e.origin != TM.origin) {
      return;
    } else {
      TM.status.received++;
      TM_worker(e.data);
    }
  }, false);
};

TM_run = function(input) {
  console.log('TM_run', input);

  if (Meteor.user()._id == 'ADMIN') {
    Meteor.subscribe('worker', input);

    TM.observer = _worker.find(input.query, input.opt).observe({
      addedAt: function(row) {
        TM.status.send++;
        TM.window.postMessage(row, TM.origin);
      },
    });
  }
};

TM_status = function() {
  console.log(TM.status);
};

TM_stop = function() {
  TM.observer.stop();
};

TM_worker = function(input) {
  if (input.error) {
    TM.status.error++;
  }

  Meteor.call('update_worker', input, function(error, res) {
    if (error) {
      console.log('TM_worker', 'error', error);
    }
  });
};
