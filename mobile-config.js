App.accessRule("*://*.googleusercontent.com/*");

App.appendToConfig(`
  <universal-links>
    <host event="ww8" name="ww8.herokuapp.com" scheme="https" />
  </universal-links>
`);

App.info({
  author: "Linto Cheeran",
  description: "Torrent Search & Alert",
  email: "linto.cet@gmail.com",
  id: "online.linto.torrent",
  name: "Torrent Alert",
  website: "https://github.com/HedCET/Torrent-Alert",
  version: "0.0.1",
});

App.setPreference("android-installLocation", "preferExternal");
App.setPreference("android-minSdkVersion", "19");
App.setPreference("AndroidLaunchMode", "singleInstance");
App.setPreference("SplashShowOnlyFirstTime", false);
App.setPreference('StatusBarBackgroundColor', '#009688');
