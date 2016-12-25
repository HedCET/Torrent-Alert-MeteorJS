if (Meteor.isCordova) {
  var _LaunchScreen = LaunchScreen.hold();

  document.addEventListener("WebComponentsReady", function() {
    window.setTimeout(function() {
      _LaunchScreen.release();
    }, 1000 * 2);

    universalLinks.subscribe('ww8', function(e) {
      if (e.url.match(/^https:\/\/ww8\.herokuapp\.com/i)) {
        document.querySelector('#app_location').path = e.url.replace(/^https:\/\/ww8\.herokuapp\.com/i, '');
      }
    });
  }, false);

  var moment = require('moment');
  var _exit = moment().toDate();

  document.addEventListener("deviceready", function(e) {
    document.addEventListener("backbutton", function(e) {
      if (moment.duration(moment().diff(_exit)).asSeconds() < 1) {
        document.querySelector("#polymer_toast").toast('Are you sure you want to exit ?', 'EXIT');
      } else {
        navigator.app.backHistory();
      }

      _exit = moment().toDate();
    }, false);
  }, false);
}
