const moment = require('moment');

(function() {
  Polymer({

    _icon_class(query) {
      let match = query.match(/:\/\/(www\.)?([^/]*)/);
      return polymer_color(match ? match[2] : '#');
    },

    _icon_text(query) {
      let match = query.match(/:\/\/(www\.)?([^/]*)/);
      return (match ? match[2].charAt(0) : '#');
    },

    _text(query) {
      let match = query.match(/:\/\/(www\.)?([^/]*)/);
      return (match ? match[2] : '#');
    },

    _time(time) {
      return moment(time).isValid() ? moment(time).format('MMM Do ddd hh:mm A') : moment().format('MMM Do ddd hh:mm A');
    },

    is: "url-item",

  });
})();
