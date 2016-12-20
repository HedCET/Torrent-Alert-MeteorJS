import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

(function() {
  Polymer({

    _google() {
      if (Meteor.status().connected) {
        if (Meteor.user()) {
          document.querySelector("#polymer_toast").toast('Are you sure you want to SignOUT ?', 'OUT');
        } else {
          this.google();
        }
      } else {
        document.querySelector('#polymer_toast').toast('lost server connection');
      }
    },

    attached() {
      let _this = this;

      _this._stop = Tracker.autorun(() => {
        _this.set('user', Meteor.user() ? _.pick(Meteor.user().profile, ['email', 'name', 'picture']) : { email: 'Synchronize with Google Account', name: 'Google Account', picture: '/png/google-plus.png' });
      });
    },

    detached() {
      if (this._stop) {
        this._stop.stop();
      }
    },

    google() {
      if (Meteor.isCordova) {
        document.querySelector('#polymer_spinner').toggle();

        Meteor.cordova_g_plus({
          cordova_g_plus: true,
          profile: ['email', 'email_verified', 'family_name', 'gender', 'given_name', 'locale', 'name', 'picture'],
          webClientId: '731987698101-thavlbcphk9v1kco7l7bl3q70dph819m.apps.googleusercontent.com',
        }, function(error) {
          document.querySelector('#polymer_spinner').toggle();

          if (error) {
            document.querySelector('#polymer_toast').toast(error);
          }
        });
      } else {
        document.querySelector('#polymer_spinner').toggle();

        Meteor.loginWithGoogle({
          requestOfflineToken: true,
          requestPermissions: ['email', 'profile']
        }, function(error) {
          document.querySelector('#polymer_spinner').toggle();

          if (error) {
            document.querySelector('#polymer_toast').toast('google errorNo - ' + Accounts.LoginCancelledError.numericError);
          }
        });
      }
    },

    is: 'layout-user',

    properties: {
      user: {
        type: Object,
        value() {
          return {
            email: 'Synchronize with Google Account',
            name: 'Google Account',
            picture: '/png/google-plus.png',
          };
        },
      },
    },

  });
})();
