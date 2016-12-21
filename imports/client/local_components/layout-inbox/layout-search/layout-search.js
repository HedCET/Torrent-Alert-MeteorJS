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

    _layout_search_changed(change) {
      if (change) {
        Meteor.subscribe('worker', [change]);

        if (this._tracker) {
          this._tracker.stop();
        }

        let _this = this;

        _this._tracker = Tracker.autorun(() => {
          let worker = _worker.findOne({
            _id: change,
          });

          if (worker) {
            _this.set('worker', worker);
          }
        });
      }
    },

    _project: function(e) {
      Meteor.call('insert_project', e.model.item, (error, res) => {
        if (error) {
          document.querySelector('#polymer_toast').toast(error.message);
        } else {
          document.querySelector('#app_location').path = '/z/project/' + res + '/1';
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

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/_recent_');
      }
    },

    is: "layout-search",

    observers: ['_layout_search_changed(route.layout_search)'],

  });
})();
