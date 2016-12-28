(function() {
  Polymer({

    _layout_main_changed(layout_main) {
      if (['filter', 'project', 'torrent'].indexOf(layout_main) == -1 && this.$.layout_inbox.querySelector('paper-scroll-header-panel')) {
        this.$.layout_inbox.querySelector('paper-scroll-header-panel').notifyResize();
      }
    },

    _PN_N(torrent) {
      alert(JSON.stringify(torrent));
    },

    _PN_R(registrationId) {
      alert(registrationId);

      // Meteor.call('insert_PN', registrationId, (error, res) => {});
    },

    attached() {
      if (!this.router.path || this.router.path == '/') {
        this.set('router.path', '/search/_recent_');
      }

      let _this = this;

      Tracker.autorun(() => {
        _this.set('user', Meteor.user() ? _.pick(Meteor.user().profile, ['email', 'name', 'picture', 'subscribed']) : { email: '', name: '', picture: '', subscribed: [] });
      });
    },

    is: "layout-main",

    observers: ['_layout_main_changed(route.layout_main)', '_PN_N(PN_N)', '_PN_R(PN_R)'],

    properties: {
      user: {
        type: Object,
        value() {
          return {
            email: '',
            name: '',
            picture: '',
            subscribed: [],
          };
        },
      },
    },

    selected_layout(route) {
      return (-1 < ['filter', 'project', 'torrent'].indexOf(route) ? 'layout-z' : 'layout-inbox');
    },

  });
})();
