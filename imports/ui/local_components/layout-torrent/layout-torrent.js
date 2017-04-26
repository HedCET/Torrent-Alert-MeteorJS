import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';
import _ from 'underscore';

import { _project } from '../../../db/projects.js';
import { _torrent } from '../../../db/torrents.js';
import { _worker } from '../../../db/workers.js';

Polymer({

  _back() {
    if (this.selected.length) {
      this.set('selected', []);
    } else {
      if (Meteor.isCordova) { navigator.app.backHistory(); }
      else { history.back(); }
    }
  },

  _route_changed(route) {
    if (route.page == 'torrent') {
      Meteor.subscribe('project', route._id.split('|'));

      if (this._project_tracker) {
        this._project_tracker.stop();
      }

      this.set('_project_tracker', Tracker.autorun(() => {
        this.set('project', _project.findOne(route._id, { fields: { query: 1, title: 1, torrent_count: 1 } }));

        if (this.project) {
          this._torrent_subscriber(this.project._id);

          if (this.project.query) {
            this._worker_subscriber(this.project.query);
          }
        }
      }));
    }
  },

  _scroll(e) {
    if (e.detail.target.scrollHeight - (e.detail.target.clientHeight * 1.5) < e.detail.target.scrollTop) {
      this.debounce('_scroll', function () {
        Meteor.subscribe('torrent', { page: ++this.page, project: this.route._id.split('|') });
      }, 1000);
    }
  },

  _sort(A, Z) {
    return (moment(Z.time).unix() - moment(A.time).unix());
  },

  _status(worker = {}) {
    switch (worker.status) {

      case '':
        return 'Indexing';
        break;

      case '200':
        return (this.torrent && this.torrent.length ? 'Updated At ' + (moment(worker.time).isValid() ? moment(worker.time).format('ddd Do MMM') : moment().format('ddd Do MMM')) : 'No Item Found');
        break;

      default:
        return worker.status;
        break;

    }
  },

  _subscribe() {
    if (Meteor.user()) {



    } else {
      document.querySelector('#toast').toast('', 'SIGNIN');
    }
  },

  _title(title, length) {
    return length ? length : title;
  },

  _torrent_subscriber(_id) {
    this.page = 1; this.set('torrent', []); Meteor.subscribe('torrent', { page: this.page, project: _id.split('|') });

    if (this._torrent_observer) {
      this._torrent_observer.stop();
    }

    this.set('_torrent_observer', _torrent.find({ project: _id }, { sort: { time: -1 } }).observe({ addedAt: (row) => { this.push('torrent', row); }, changedAt: (row) => { this.splice('torrent', _.findIndex(this.torrent, { _id: row._id }), 1, row); }, removedAt: (row) => { this.splice('torrent', _.findIndex(this.torrent, { _id: row._id }), 1); } }));
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

  attached() {
    Tracker.autorun(() => {
      if (Meteor.user()) {
        this.set('user', Meteor.user().profile);
      }
    });
  },

  is: 'layout-torrent',

  observers: ['_route_changed(route)'],

  properties: {
    selected: {
      type: Array,
      value() {
        return [];
      },
    },
    torrent: {
      type: Array,
      value() {
        return [];
      },
    },
  },

});

import './torrent-item.js';
