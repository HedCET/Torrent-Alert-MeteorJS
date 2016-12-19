import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

(function() {
  Polymer({

    _label: function(response, status) {
      switch (status) {
        case '':
          return 'indexing';
          break;

        case '200':
          return (response.length ? response.length + ' item' : 'noItemFound');
          break;

        default:
          return status;
          break;
      }
    },

    _search() {
      clearTimeout(this._search_handler ? this._search_handler : null);

      let _this = this;

      _this._search_handler = setTimeout(() => {
        _this.keyword = _this.keyword.replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/\s+/g, ' ').trim();

        if (_this.keyword) {
          if (Meteor.status().connected) {
            Meteor.call('insert_worker', _this.keyword + ' added:60d seeds > 0', (error, res) => {
              if (error) {
                document.querySelector('#polymer_toast').toast(error.message);
              } else {
                _this.set('query.worker', res);
              }
            });
          } else {
            document.querySelector('#polymer_toast').toast('lost server connection');
          }
        }
      }, 1000);
    },

    _worker_changed(worker) {
      if (this.online) {
        if (worker) {
          let _this = this;

          Tracker.autorun(() => {
            Meteor.subscribe('worker', [worker]);
          });

          Tracker.autorun(() => {
            let row = _worker.findOne({
              _id: worker,
            });

            if (row) {
              _this.set('worker', row);
            }
          });
        }
      }
    },

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/');
      }

      if (!this.query.worker) {
        this.set('query.worker', '_recent_');
      }
    },

    behaviors: [Polymer.AppNetworkStatusBehavior],

    is: "layout-search",

    observers: ['_worker_changed(query.worker)'],

  });
})();
