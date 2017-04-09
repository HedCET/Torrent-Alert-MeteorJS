import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';

import { _worker } from '../../../db/workers.js';

Polymer({

  _route_changed(route) {
    if (route.page == 'search') {
      Meteor.subscribe('worker', route._id.split('|'));

      if (this._search_tracker) {
        this._search_tracker.stop();
      }

      let _this = this;

      _this.set('_search_tracker', Tracker.autorun(() => {
        _this.set('worker', _worker.findOne(route._id, { fields: { project: 1, status: 1, time: 1 } }));
      }));
    }
  },

  _search(e) {
    if (this._search_timer) {
      Meteor.clearTimeout(this._search_timer);
    }

    let value = e.target.value.replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/\s+/g, ' ').trim();

    if (value) {
      this.set('_search_timer', Meteor.setTimeout(() => {
        if (Meteor.status().connected) {
          Meteor.call('insert.keyword', value, (error, res) => {
            if (error) {
              document.querySelector('#toast').toast(error.message);
            } else {
              document.querySelector('#main').set('router.path', '/search/' + res);
            }
          });
        }
      }, 1000));
    }
  },

  _status(worker = {}) {
    switch (worker.status) {

      case '':
        return 'Indexing';
        break;

      case '200':
        return (worker.project.length ? 'Updated At ' + (moment(worker.time).isValid() ? moment(worker.time).format('ddd Do MMM') : moment().format('ddd Do MMM')) : 'No Item Found');
        break;

      default:
        return worker.status;
        break;

    }
  },

  is: 'layout-search',

  observers: ['_route_changed(route)'],

});

import './search-item.js';
