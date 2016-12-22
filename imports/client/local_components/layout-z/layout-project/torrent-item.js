const moment = require('moment');

(function() {
  Polymer({

    _date(time) {
      return (moment(time).isValid() ? moment(time).format('MMM Do ddd') : moment().format('MMM Do ddd'));
    },

    _icon_class(text) {
      return polymer_color(text ? text : '#');
    },

    _icon_text(length) {
      return (length ? length : '#');
    },

    _very_good(very_good) {
      return (very_good ? 'very_good' : '');
    },

    is: "torrent-item",

  });
})();
