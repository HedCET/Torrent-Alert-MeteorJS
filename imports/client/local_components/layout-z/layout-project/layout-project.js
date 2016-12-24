import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

const moment = require('moment');
const underscore = require('underscore');

(function() {
  Polymer({

    _add() {
      Meteor.users.update({
        _id: Meteor.user()._id,
      }, {
        $addToSet: {
          'profile.subscribed': this.route.layout_project,
        },
      });
    },

    _back: function() {
      if (this.selected.length) {
        this.set('selected', []);
      } else {
        if (Meteor.isCordova) {
          navigator.app.backHistory();
        } else {
          history.back();
        }
      }
    },

    _delete() {
      document.querySelector('#polymer_spinner').toggle();

      let selected = _.map(this.selected, (item) => {
        return item._id;
      });

      let _this = this;

      Meteor.call('remove_torrent', selected, (error, res) => {
        document.querySelector('#polymer_spinner').toggle();

        if (error) {
          document.querySelector('#polymer_toast').toast(error.message);
        } else {
          document.querySelector('#polymer_toast').toast(res, 'UNDO', { torrent: selected });

          _this.set('selected', []);
        }
      });
    },

    _filter() {
      console.log('_filter');
    },

    _layout_project_changed(layout_project) {
      if (layout_project && document.querySelector('#app_location').path.match(/^\/z\/project/)) {
        this.page = 1;

        this.set('torrent', []);

        Meteor.subscribe('project', [layout_project]);
        Meteor.subscribe('torrent', { page: this.page, project: [layout_project] });

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

    _scroll(e) {
      if (e.detail.target.scrollHeight - (e.detail.target.clientHeight * 1.5) < e.detail.target.scrollTop) {
        this.debounce('_scroll', function() {
          Meteor.subscribe('torrent', { page: ++this.page, project: [this.route.layout_project] });
        }, 1000 * 3);
      }
    },

    _selected(length) {
      return (length ? 'hidden' : '');
    },

    _share() {
      let share = '';

      this.selected.forEach(function(torrent) {
        share += "\n\n" + torrent.category + "\t\t" + torrent.size + "\t\t" + torrent.title + "\t\t" + Meteor.absoluteUrl('z/torrent/' + torrent._id) + "\n\n";
      });

      if (share != '') {
        if (Meteor.isCordova) {
          window.plugins.socialsharing.share(share);
        } else {
          window.open('mailto:?subject=' + encodeURIComponent('Torrent Alert') + '&body=' + encodeURIComponent(share), "_system");
        }

        this.set('selected', []);
      }
    },

    _sort(A, Z) {
      return (moment(Z.time).unix() - moment(A.time).unix());
    },

    _status(torrentLength, projectError) {
      if (torrentLength) {
        return torrentLength + ' item';
      } else {
        switch (projectError) {
          case '':
            return 'indexing';
            break;

          default:
            return projectError;
            break;
        }
      }
    },

    _subscribed(subscribed, layout_project) {
      return (-1 < subscribed.indexOf(layout_project));
    },

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/_project_');
      }
    },

    is: "layout-project",

    observers: ['_layout_project_changed(route.layout_project)'],

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
})();
