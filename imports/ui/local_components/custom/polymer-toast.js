import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

Polymer({

  _close() {
    const N = document.querySelectorAll('.opt-bottom'); for (let index = 0; index < N.length; index++) { N[index].style.transform = 'translate(0, -' + this.$._toast.getBoundingClientRect().height + 'px)'; }

    this.condition = '';
  },

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
            else { document.querySelector('#main').set('router.path', '/user/' + Meteor.user()._id); }
          });
        } else {
          Meteor.loginWithGoogle({ requestOfflineToken: true, requestPermissions: ['email', 'profile'] }, (error) => {
            document.querySelector('#spinner').toggle();

            if (error) { document.querySelector('#toast').toast('Error'); }
            else { document.querySelector('#main').set('router.path', '/user/' + Meteor.user()._id); }
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

  _open() {
    this.async(() => {
      const N = document.querySelectorAll('.opt-bottom'); for (let index = 0; index < N.length; index++) { N[index].style.transform = 'translate(0, -' + this.$._toast.getBoundingClientRect().height + 'px)'; }
    }, 20);
  },

  attached() {
    this._class = (Meteor.isCordova ? 'fit-bottom' : '');

    Tracker.autorun(() => {
      if (Meteor.status().connected) {
        this.toast('server connected');
      } else {
        this.toast('lost server connection');
      }
    });
  },

  is: 'polymer-toast',

  toast(text, condition, store) {
    this.$._toast.hide();

    this.async(() => {
      this.$._toast.text = text;

      this.condition = (condition ? condition : '');

      if (store) {
        this.set('store', store);
      }

      this.$._toast.show();
    }, 400);
  },

});
