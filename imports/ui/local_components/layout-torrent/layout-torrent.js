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

      let _this = this;

      _this.set('_project_tracker', Tracker.autorun(() => {
        _this.set('project', _project.findOne(route._id, { fields: { query: 1, title: 1, torrent_count: 1 } }));

        if (_this.project) {
          _this.page = 1; Meteor.subscribe('torrent', { page: _this.page, project: _this.project._id.split('|') });

          if (_this._torrent_observer) {
            _this._torrent_observer.stop();
          }

          _this.set('_torrent_observer', _torrent.find({ project: _this.project._id }, { sort: { time: -1 } }).observe({ addedAt(row) { _this.push('torrent', row); }, changedAt(row) { _this.splice('torrent', _.findIndex(_this.torrent, { _id: row._id }), 1, row); }, removedAt(row) { _this.splice('torrent', _.findIndex(_this.torrent, { _id: row._id }), 1); } }));

          if (_this.project.query) {
            Meteor.subscribe('worker', _this.project.query); _this.set('worker', _worker.findOne({ query: _this.project.query }, { fields: { query: 1, status: 1, time: 1 } }));
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
      document.querySelector('#main').set('router.path', '/user/' + Meteor.user()._id);
    } else {
      document.querySelector('#toast').toast('', 'SIGNIN');
    }
  },

  _title(title, length) {
    return length ? length : title;
  },

  attached() {
    let _this = this;

    Tracker.autorun(() => {
      if (Meteor.user()) {
        _this.set('user', Meteor.user().profile);
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
