if (Meteor.isCordova) {
  var _LaunchScreen = LaunchScreen.hold();

  document.addEventListener("WebComponentsReady", function() {
    window.setTimeout(function() {
      _LaunchScreen.release();
    }, 1000 * 2);
  }, false);

  var moment = require('moment');
  var _exit = moment().toDate();

  document.addEventListener("WebComponentsReady", function() {
    document.addEventListener("backbutton", function() {
      if (moment.duration(moment().diff(_exit)).asSeconds() < 1) {
        document.querySelector("#polymer_toast").toast('Are you sure you want to exit ?', 'EXIT');
      } else {
        navigator.app.backHistory();
      }

      _exit = moment().toDate();
    }, false);
  }, false);

  document.addEventListener("WebComponentsReady", function() {
    universalLinks.subscribe('ww8', function(e) {
      let url = new URL(e.url);

      if (url.hostname == 'ww8.herokuapp.com') {
        document.querySelector('#app_location').path = url.pathname;
      }
    });
  }, false);
}
