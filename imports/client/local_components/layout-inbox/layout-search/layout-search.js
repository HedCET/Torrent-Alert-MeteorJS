import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

(function() {
  Polymer({

    _label: function(project, status) {
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
      if (worker) {
        Meteor.subscribe('worker', [worker]);

        if (this._stop) {
          this._stop.stop();
        }

        let _this = this;

        _this._stop = Tracker.autorun(() => {
          let row = _worker.findOne({
            _id: worker,
          });

          if (row && row.response && row.response.length) {
            _this.set('worker', row);
          }
        });
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

    is: "layout-search",

    observers: ['_worker_changed(query.worker)'],

  });
})();
