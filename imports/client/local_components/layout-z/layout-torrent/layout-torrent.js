import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

const underscore = require('underscore');

(function() {
  Polymer({

    _back: function() {
      if (Meteor.isCordova) {
        navigator.app.backHistory();
      } else {
        history.back();
      }
    },

    _category_class(text) {
      return polymer_color(text ? text : '#');
    },

    _layout_torrent_changed(layout_torrent) {
      if (layout_torrent) {
        Meteor.subscribe('torrent', { torrent: [layout_torrent] });

        if (this._tracker) {
          this._tracker.stop();
        }

        let _this = this;

        _this._tracker = Tracker.autorun(() => {
          let torrent = _torrent.findOne({
            _id: layout_torrent,
          });

          if (torrent) {
            _this.set('torrent', torrent);
            _this._torrent_changed(torrent);
          }
        });
      }
    },

    _torrent_changed(torrent) {
      if (torrent.url.length) {
        this.set('url', []);

        Meteor.subscribe('url', torrent.url);

        if (this._observe) {
          this._observe.stop();
        }

        let _this = this;

        _this._observe = _url.find({
          _id: {
            $in: torrent.url,
          },
        }).observe({
          addedAt(row) {
            _this.push('url', row);
          },

          changedAt(row) {
            _this.splice('url', underscore.findIndex(_this.url, { _id: row._id }), 1, row);
          },

          removedAt(row) {
            _this.splice('url', underscore.findIndex(_this.url, { _id: row._id }), 1);
          },
        });
      }
    },

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/_torrent_');
      }
    },

    is: "layout-torrent",

    observers: ['_layout_torrent_changed(route.layout_torrent)'],

  });
})();
