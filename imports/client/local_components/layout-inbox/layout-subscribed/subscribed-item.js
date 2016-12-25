(function() {
  Polymer({

    _added(query) {
      let match = query.match(/ added.*?([0-9]+)[a-z] ?/i);
      return (match && +match[1] ? match[1] : 'zero');
    },

    _icon_class(text) {
      return polymer_color(text ? text : '#');
    },

    _icon_text(text) {
      return (text ? text.charAt(0) : '#');
    },

    _project(e) {
      if (Polymer.dom(e).localTarget.id != 'selectable_icon') {
        e.stopPropagation();

        document.querySelector('#polymer_spinner').toggle();

        Meteor.call('worker_project', this.item._id, (error, res) => {
          document.querySelector('#polymer_spinner').toggle();

          if (error) {
            document.querySelector('#polymer_toast').toast(error.message);
          } else {
            document.querySelector('#app_location').path = '/z/project/' + res;
          }
        });
      }
    },

    _seed(query) {
      let match = query.match(/ seed.*?([0-9]+) ?/i);
      return (match && +match[1] ? match[1] : 'zero');
    },

    is: "subscribed-item",

  });
})();
