(function() {
  Polymer({

    _back() {
      if (Meteor.isCordova) {
        navigator.app.backHistory();
      } else {
        history.back();
      }
    },

    _done() {
      if (this.project) {
        document.querySelector('#polymer_spinner').toggle();

        Meteor.call('insert_project', { query: '/' + this.quality + '?f=' + this.project.title + ' added:' + this.period + 'd seed > ' + this.seed + (this.ACF ? '&safe=1' : ''), title: this.project.title }, (error, res) => {
          document.querySelector('#polymer_spinner').toggle();

          if (error) {
            document.querySelector('#polymer_toast').toast(error.message);
          } else {
            document.querySelector('#app_location').path = '/z/project/' + res;
          }
        });
      }
    },

    _layout_filter_changed(layout_filter) {
      if (layout_filter && document.querySelector('#app_location').path.match(/^\/z\/filter/)) {
        Meteor.subscribe('project', [layout_filter]);

        if (this._tracker) {
          this._tracker.stop();
        }

        let _this = this;

        _this._tracker = Tracker.autorun(() => {
          let project = _project.findOne({
            _id: layout_filter,
          });

          if (project) {
            _this._project_changed(project);
          }
        });
      }
    },

    _project_changed(project) {
      this.set('project', project);

      if (project.query) {
        let ACF = project.query.match(/&safe=(0|1)/i);
        this.ACF = (ACF && +ACF[1] ? ACF[1] : null);

        let period = project.query.match(/ added.*?([0-9]+)[a-z] ?/i);
        this.period = (period && +period[1] ? +period[1] : 30);

        let quality = project.query.match(/\/([^\/]*)\?/);
        this.quality = (quality && -1 < quality[1].indexOf('verified') ? 'verified' : 'search');

        let seed = project.query.match(/ seed.*?([0-9]+) ?/i);
        this.seed = (seed && +seed[1] ? +seed[1] : 500);
      }
    },

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/_filter_');
      }
    },

    is: "layout-filter",

    observers: ['_layout_filter_changed(route.layout_filter)'],

  });
})();
