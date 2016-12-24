import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
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

    _delete() {
      document.querySelector('#polymer_spinner').toggle();

      let _this = this;

      Meteor.call('remove_torrent', [_this.route.layout_torrent], (error, res) => {
        document.querySelector('#polymer_spinner').toggle();

        if (error) {
          document.querySelector('#polymer_toast').toast(error.message);
        } else {
          document.querySelector('#polymer_toast').toast(res, 'UNDO', { torrent: [_this.route.layout_torrent] });

          _this._back();
        }
      });
    },

    _download() {
      let torrent = Random.choice(this.url);

      if (torrent) {
        if (this.proxy) {
          window.open(Meteor.absoluteUrl('proxy?url=' + encodeURIComponent(encodeURIComponent(torrent.query))), '_system');
        } else {
          window.open(torrent.query, '_system');
        }
      }
    },

    _layout_torrent_changed(layout_torrent) {
      if (layout_torrent && document.querySelector('#app_location').path.match(/^\/z\/torrent/)) {
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

    _share() {
      let share = "\n\n" + this.torrent.category + "\t\t" + this.torrent.size + "\t\t" + this.torrent.title + "\t\t" + Meteor.absoluteUrl('z/torrent/' + this.route.layout_torrent) + "\n\n";

      if (Meteor.isCordova) {
        window.plugins.socialsharing.share(share);
      } else {
        window.open('mailto:?subject=' + encodeURIComponent('Torrent Alert') + '&body=' + encodeURIComponent(share), '_system');
      }
    },

    _torrent_changed(torrent) {
      if (torrent.url.length) {
        this.set('url', []);

        Meteor.subscribe('url', torrent.url);

        if (this._observer) {
          this._observer.stop();
        }

        let _this = this;

        _this._observer = _url.find({
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

    _url(e) {
      if (this.proxy) {
        window.open(Meteor.absoluteUrl('proxy?url=' + encodeURIComponent(encodeURIComponent(e.model.item.query))), '_system');
      } else {
        window.open(e.model.item.query, '_system');
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
