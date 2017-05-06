import { Meteor } from 'meteor/meteor';

Polymer({

  _open() {
    window.open('https://t.orrent.xyz/search/recent', '_blank');
  },

  attached() {
    this.index = this.fixture.length - 1; this.text = this.fixture[this.index]; this.timer = Meteor.setInterval(() => { this.index -= 1; this.text = this.fixture[this.index]; if (this.index < 1) { Meteor.clearInterval(this.timer); } }, 1000 * 3);
  },

  is: 'layout-main',

  properties: {
    fixture: {
      type: Array,
      value() {
        return ['synchronizing error', 'synchronizing to latest version', 'clearing cache', 'checking latest version', 'connecting to t.orrent.xyz'];
      },
    },
  },

});
