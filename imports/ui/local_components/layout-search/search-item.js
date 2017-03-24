import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

import { _project } from '../../../db/projects.js';

Polymer({

  _project() {
    if (this.project) {
      Meteor.call('trigger_project', this.project._id, (error, res) => {
        if (error) {
          document.querySelector('#toast').toast(error.message);
        } else {
          document.querySelector('#location').set('route.path', '/project/' + res);
        }
      });
    }
  },

  _item_changed(item) {
    Meteor.subscribe('project', item.split('|'));

    if (this._item_tracker) {
      this._item_tracker.stop();
    }

    let _this = this;

    _this.set('_item_tracker', Tracker.autorun(() => {
      _this.set('project', _project.findOne(item, { fields: { title: 1, torrent_count: 1 } }));
    }));
  },

  is: 'search-item',

  number_string(number) {
    if (9999 < number) {
      return Math.round(number / 1000) + 'K';
    }

    return number;
  },

  observers: ['_item_changed(item)'],

});





