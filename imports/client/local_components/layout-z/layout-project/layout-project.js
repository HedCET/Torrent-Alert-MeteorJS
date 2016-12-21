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

    _layout_project_changed(layout_project) {
      if (layout_project) {
        this.set('torrent', []);

        Meteor.subscribe('project', [layout_project]);
        Meteor.subscribe('torrent', { page: 1, project: [this.route.layout_project] });

        if (this._tracker) {
          this._tracker.stop();
        }

        if (this._observe) {
          this._observe.stop();
        }

        let _this = this;

        _this._tracker = Tracker.autorun(() => {
          _this.set('project', _project.findOne({ _id: layout_project }));
        });

        _this._observe = _torrent.find({
          project: layout_project,
        }).observe({
          addedAt(row) {
            _this.push('torrent', row);
          },

          changedAt(row) {
            _this.splice('torrent', underscore.findIndex(_this.torrent, { _id: row._id }), 1, row);
          },

          removedAt(row) {
            _this.splice('torrent', underscore.findIndex(_this.torrent, { _id: row._id }), 1);
          },
        });
      }
    },

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/_project_');
      }
    },

    is: "layout-project",

    observers: ['_layout_project_changed(route.layout_project)'],

    properties: {
      torrent: {
        type: Array,
        value() {
          return [];
        },
      },
    },

  });
})();
