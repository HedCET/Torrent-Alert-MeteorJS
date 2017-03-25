import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

Polymer({

  _condition() {
    this.$._toast.hide();

    switch (this.condition) {

      case 'EXIT':
        if (Meteor.isCordova) {
          navigator.app.exitApp();
        }
        break;

      case 'SIGNIN':
        document.querySelector('#spinner').toggle();

        if (Meteor.isCordova) {
          Meteor.cordova_g_plus({ cordova_g_plus: true, profile: ['email', 'email_verified', 'family_name', 'gender', 'given_name', 'locale', 'name', 'picture'], webClientId: '731987698101-thavlbcphk9v1kco7l7bl3q70dph819m.apps.googleusercontent.com' }, (error) => {
            document.querySelector('#spinner').toggle();

            if (error) { document.querySelector('#toast').toast('Error'); }
            else { document.querySelector('#location').set('route.path', '/user/' + Meteor.user()._id); }
          });
        } else {
          Meteor.loginWithGoogle({ requestOfflineToken: true, requestPermissions: ['email', 'profile'] }, (error) => {
            document.querySelector('#spinner').toggle();

            if (error) { document.querySelector('#toast').toast('Error'); }
            else { document.querySelector('#location').set('route.path', '/user/' + Meteor.user()._id); }
          });
        }
        break;

      case 'SIGNOUT':
        Meteor.logout((error) => {
          if (error) { document.querySelector('#toast').toast('Error'); }
          else {
            if (Meteor.isCordova) {
              window.plugins.googleplus.disconnect();
              navigator.app.backHistory();
            }
            else { history.back(); }
          }
        });
        break;

    }

    this.condition = '';
  },

  _transition() {
    if (!this.$._toast.opened) {
      this.condition = '';
    }
  },

  attached() {
    this._class = (Meteor.isCordova ? 'fit-bottom' : '');

    var _this = this;

    Tracker.autorun(() => {
      if (Meteor.status().connected) {
        _this.toast('server connected');
      } else {
        _this.toast('lost server connection');
      }
    });
  },

  is: 'polymer-toast',

  toast(text, condition, store) {
    this.$._toast.hide();

    let _this = this;

    _this.async(() => {
      _this.$._toast.text = text;

      _this.condition = (condition ? condition : '');

      if (store) {
        _this.set('store', store);
      }

      _this.$._toast.show();
    }, 400);
  },

});
