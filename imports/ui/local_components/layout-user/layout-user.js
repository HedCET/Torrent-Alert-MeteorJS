import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Polymer({

  _back() {
    if (this.selected.length) {
      this.set('selected', []);
    } else {
      if (Meteor.isCordova) { navigator.app.backHistory(); }
      else { history.back(); }
    }
  },

  _remove() {
    // Meteor.users.update(Meteor.user()._id, {
    //   $pull: {
    //     'profile.subscribed': {
    //       $in: this.selected,
    //     },
    //   }
    // });

    this.selected.forEach((_id) => {
      Meteor.users.update(Meteor.user()._id, {
        $pull: {
          'profile.subscribed': _id,
        },
      });
    });

    document.querySelector('#toast').toast(this.selected.length + ' Item Removed', 'UNDO', { redo_subscribe: this.selected });

    this.set('selected', []);
  },

  _SIGNOUT() {
    document.querySelector('#toast').toast('', 'SIGNOUT');
  },

  attached() {
    Tracker.autorun(() => {
      if (Meteor.user()) {
        this.set('user', Meteor.user().profile);
      }
    });
  },

  is: 'layout-user',

  properties: {
    selected: {
      type: Array,
      value() {
        return [];
      },
    }
  },

});

import './subscribed-item.js';
import '../custom/selectable-icon.js';
