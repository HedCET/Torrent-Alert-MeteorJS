import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

const underscore = require('underscore');

(function() {
  Polymer({

    _label(project, status) {
      switch (status) {
        case '':
          return 'indexing';
          break;

        case '200':
          return (project.length ? project.length + ' item' : 'noItemFound');
          break;

        default:
          return status;
          break;
      }
    },

    _layout_search_changed(layout_search) {
      if (layout_search) {
        Meteor.subscribe('worker', [layout_search]);

        if (this._tracker) {
          this._tracker.stop();
        }

        let _this = this;

        _this._tracker = Tracker.autorun(() => {
          let worker = _worker.findOne({
            _id: layout_search,
          });

          if (worker) {
            _this.set('worker', worker);
            _this._worker_changed(worker);
          }
        });
      }
    },

    _project(e) {
      document.querySelector('#polymer_spinner').toggle();

      Meteor.call('insert_project', e.model.item._id, (error, res) => {
        document.querySelector('#polymer_spinner').toggle();

        if (error) {
          document.querySelector('#polymer_toast').toast(error.message);
        } else {
          document.querySelector('#app_location').path = '/z/project/' + res;
        }
      });
    },

    _search() {
      clearTimeout(this._search_handler ? this._search_handler : null);

      let _this = this;

      _this._search_handler = setTimeout(() => {
        _this.keyword = _this.keyword.replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/\s+/g, ' ').trim();

        if (_this.keyword) {
          if (Meteor.status().connected) {
            Meteor.call('insert_keyword', _this.keyword, (error, res) => {
              if (error) {
                document.querySelector('#polymer_toast').toast(error.message);
              } else {
                _this.set('route.layout_search', res);
              }
            });
          } else {
            document.querySelector('#polymer_toast').toast('lost server connection');
          }
        }
      }, 1000);
    },

    _worker_changed(worker) {
      if (worker.project.length) {
        this.set('project', []);

        Meteor.subscribe('project', worker.project);

        if (this._observe) {
          this._observe.stop();
        }

        let _this = this;

        _this._observe = _project.find({
          _id: {
            $in: worker.project,
          },
        }).observe({
          addedAt(row) {
            _this.push('project', row);
          },

          changedAt(row) {
            _this.splice('project', underscore.findIndex(_this.project, { _id: row._id }), 1, row);
          },

          removedAt(row) {
            _this.splice('project', underscore.findIndex(_this.project, { _id: row._id }), 1);
          },
        });
      }
    },

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/_recent_');
      }
    },

    is: "layout-search",

    observers: ['_layout_search_changed(route.layout_search)'],

  });
})();
