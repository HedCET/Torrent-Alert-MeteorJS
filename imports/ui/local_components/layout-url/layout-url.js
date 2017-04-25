import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';

import { _torrent } from '../../../db/torrents.js';
import { _worker } from '../../../db/workers.js';

Polymer({

  _back() {
    if (Meteor.isCordova) { navigator.app.backHistory(); }
    else { history.back(); }
  },

  _route_changed(route) {
    if (route.page == 'url') {
      Meteor.subscribe('torrent', { torrent: route._id.split('|') });

      if (this._torrent_tracker) {
        this._torrent_tracker.stop();
      }

      this.set('_torrent_tracker', Tracker.autorun(() => {
        this.set('torrent', _torrent.findOne(route._id, { fields: {} }));

        if (this.torrent && this.torrent.query) {
          this._worker_subscriber(this.torrent.query);
        }
      }));
    }
  },

  _status(worker = {}) {
    switch (worker.status) {

      case '':
        return 'Indexing';
        break;

      case '200':
        return (this.torrent.url.length ? 'Updated At ' + (moment(worker.time).isValid() ? moment(worker.time).format('ddd Do MMM') : moment().format('ddd Do MMM')) : 'No Item Found');
        break;

      default:
        return worker.status;
        break;

    }
  },

  _worker_subscriber(query) {
    Meteor.subscribe('worker', query);

    if (this._worker_tracker) {
      this._worker_tracker.stop();
    }

    this.set('_worker_tracker', Tracker.autorun(() => {
      this.set('worker', _worker.findOne({ query }, { fields: { query: 1, status: 1, time: 1 } }));
    }));
  },

  is: 'layout-url',

  observers: ['_route_changed(route)'],

});

import './url-item.js';
