import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

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
        Meteor.subscribe('project', [layout_project]);

        if (this._tracker_project) {
          this._tracker_project.stop();
        }

        let _this = this;

        _this._tracker_project = Tracker.autorun(() => {
          _this.set('project', _project.findOne({ _id: layout_project }));
        });
      }
    },

    _page_changed(page) {
      if (this.route.layout_project && page) {
        Meteor.subscribe('torrent', { page: +page, project: [this.route.layout_project] });

        if (this._tracker_page) {
          this._tracker_page.stop();
        }

        let _this = this;

        _this._tracker_page = Tracker.autorun(() => {
          _this.set('torrent', _torrent.find({ project: _this.route.layout_project }).fetch());
        });
      }
    },

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/_project_/1');
      }

      if (!this.route.page) {
        this.set('router.path', this.router.path + '/1');
      }
    },

    is: "layout-project",

    observers: ['_layout_project_changed(route.layout_project)', '_page_changed(route.page)'],

  });
})();
