if (Meteor.isCordova) {
  var _LaunchScreen = LaunchScreen.hold();

  document.addEventListener("WebComponentsReady", function() {
    window.setTimeout(function() {
      _LaunchScreen.release();
    }, 1000 * 2);
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
