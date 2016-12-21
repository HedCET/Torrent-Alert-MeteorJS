(function() {
  Polymer({

    _delete() {
      // switch (this.selected) {
      //   case 'subscribed':
      //     this.selected_subscribed = [];
      //     break;
      // }
    },

    _info() {
      window.open('https://github.com/HedCET/Torrent-Alert/wiki', '_system');
    },

    _hidden(value) {
      return !!value;
    },

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/search');
      }
    },

    is: "layout-inbox",

    properties: {
      selected_subscribed: {
        type: Array,
        value() {
          return [];
        },
      },
    },

  });
})();
