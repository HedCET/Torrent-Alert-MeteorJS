import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Polymer({

  _back() {
    if (Meteor.isCordova) { navigator.app.backHistory(); }
    else { history.back(); }
  },

  _SIGNOUT() {
    document.querySelector('#toast').toast('', 'SIGNOUT');
  },

  attached() {
    let _this = this;

    Tracker.autorun(() => {
      if (Meteor.user()) {
        _this.set('user', Meteor.user().profile);
      }
    });
  },

  is: 'layout-user',

});
