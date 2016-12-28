if (Meteor.isCordova) {
  document.addEventListener("deviceready", function() {
    var PN = PushNotification.init({
      android: {
        clearBadge: true,
        forceShow: true,
        icon: 'www/application/app/icons/ldpi.png',
        // iconColor: '#009688',
        senderID: '731987698101',
      },
      browser: {},
      ios: {},
      windows: {},
    });

    PushNotification.hasPermission(function(res) {
      document.addEventListener("WebComponentsReady", function() {
        if (!res.isEnabled) {
          Meteor.setTimeout(function() {
            document.querySelector('#polymer_toast').toast('pushAlert permission denied');
          }, 1000 * 16);
        }
      }, false);
    });

    PN.on('error', function(e) {
      document.addEventListener("WebComponentsReady", function() {
        document.querySelector('#polymer_toast').toast(e.message);
      }, false);
    });

    PN.on('notification', function(res) {
      document.addEventListener("WebComponentsReady", function() {
        document.querySelector('#layout_main').set('PN_N', (res.additionalData.torrent ? res.additionalData.torrent : []));
      }, false);
    });

    PN.on('registration', function(res) {
      document.addEventListener("WebComponentsReady", function() {
        document.querySelector('#layout_main').set('PN_R', res.registrationId);
      }, false);
    });

    document.addEventListener("WebComponentsReady", function() {
      document.querySelector('#layout_main').set('PN', PN);
    }, false);
  }, false);

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

  universalLinks.subscribe('ww8', function(e) {
    document.addEventListener("WebComponentsReady", function() {
      document.querySelector('#app_location').set('path', '/search/_recent_');

      var url = new URL(e.url);

      if (url.hostname == 'ww8.herokuapp.com') {
        document.querySelector('#app_location').set('path', url.pathname);
      }
    }, false);
  });
}
