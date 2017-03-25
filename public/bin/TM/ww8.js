// ==UserScript==
// @author       linto.cet@gmail.com
// @description  ww8
// @match        *://localhost:3000/*
// @match        *://ww8.herokuapp.com/*
// @name         ww8
// @namespace    *://localhost:3000/*
// @require      momentjs.com/downloads/moment.min.js
// @require      underscorejs.org/underscore-min.js
// @version      1.0.0
// ==/UserScript==

'use strict';

var TM = {};

TM.observer = function (input) {
  if (Meteor && Meteor.user()._id == 'ADMIN') {
    Meteor.subscribe('worker', input);

    _worker.find(input.query, input.opt)
      .observe({
        addedAt: function (row) {
          if (TM.send) { TM.send += 1; }
          else { TM.send = 1; }

          TM.window.postMessage(row, TM.origin);
        },
      });

    console.log('TM.observer', input);
  }
};

TM.loader = function (origin) {
  if (Meteor && Meteor.user()._id == 'ADMIN') {
    TM.origin = origin;
    TM.window = window.open(origin);

    window.addEventListener('message', function (e) {
      if (e.origin != TM.origin) {
        return;
      } else {
        if (TM.receive) { TM.receive += 1; }
        else { TM.receive = 1; }

        if (e.data.error) {
          if (TM.error) { TM.error += 1; }
          else { TM.error = 1; }
        }

        Meteor.call('worker.update', e.data, function (error, res) {
          if (error) {
            console.log('worker.update', error);
          }
        });
      }
    }, false);

    console.log('TM.loader', origin);
  }
};
