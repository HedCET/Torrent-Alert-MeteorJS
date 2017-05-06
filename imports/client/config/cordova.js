import { Meteor } from 'meteor/meteor';

if (Meteor.isCordova) {
  let LS = null; document.addEventListener('deviceready', function () { LS = LaunchScreen.hold(); document.addEventListener('WebComponentsReady', function () { if (LS) { LS.release(); } }, false); }, false);
}
