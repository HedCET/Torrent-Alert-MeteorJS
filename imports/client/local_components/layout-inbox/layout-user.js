Polymer({

  _google_sign_in() {
    if (Meteor.status().connected) {
      if (Meteor.isCordova) {
        Meteor.cordova_g_plus({
          cordova_g_plus: true,
          profile: ['email', 'email_verified', 'family_name', 'gender', 'given_name', 'locale', 'name', 'picture'],
          webClientId: '731987698101-thavlbcphk9v1kco7l7bl3q70dph819m.apps.googleusercontent.com',
        }, function(error) {
          if (error) {
            alert(error);
          }
        });
      } else {
        Meteor.loginWithGoogle({
          requestOfflineToken: true,
          requestPermissions: ['email', 'profile']
        }, function(error) {
          if (error) {
            console.log('Google SignIn ErrorNo - ' + Accounts.LoginCancelledError.numericError);
          }
        });
      }
    } else {
      console.log('lost server connection');
    }
  },

  is: 'layout-user',

});
