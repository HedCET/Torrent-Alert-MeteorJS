const moment = require('moment');

(function() {
  Polymer({

    _icon_class(text) {
      return polymer_color(text ? text : '#');
    },

    _icon_text(length) {
      return (length ? length : '#');
    },

    _time(time) {
      return (moment(time).isValid() ? moment(time).format('MMM Do ddd') : moment().format('MMM Do ddd'));
    },

    _very_good(very_good) {
      return (very_good ? 'very_good' : '');
    },

    is: "torrent-item",

  });
})();
