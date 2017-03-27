import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { _project } from '../../../db/projects.js';
import { _torrent } from '../../../db/torrents.js';

Polymer({

  _back() {
    if (Meteor.isCordova) { navigator.app.backHistory(); }
    else { history.back(); }
  },

  _route_changed(route) {
    if (route.page == 'torrent') {
      Meteor.subscribe('project', route._id.split('|'));

      if (this._project_tracker) {
        this._project_tracker.stop();
      }

      let _this = this;

      _this.set('_project_tracker', Tracker.autorun(() => {
        _this.set('project', _project.findOne(route._id, { fields: { title: 1, torrent_count: 1 } }));
      }));
    }
  },

  attached() {
    let _this = this;

    Tracker.autorun(() => {
      if (Meteor.user()) {
        _this.set('user', Meteor.user().profile);
      }
    });
  },

  is: 'layout-torrent',

  observers: ['_route_changed(route)'],

});
