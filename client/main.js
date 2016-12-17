import '../imports/client';

if (Meteor.isCordova) {
  Meteor.cordova_g_plus({
    cordova_g_plus: true,
    profile: ["email", "email_verified", "gender", "locale", "name", "picture"],
    webClientId: '731987698101-thavlbcphk9v1kco7l7bl3q70dph819m.apps.googleusercontent.com',
  }, function(error) {
    if (error) {
      alert(error);
    }
  });
}
