(function() {
  Polymer({

    _layout_main_changed(layout_main) {
      if (layout_main == 'layout-inbox' && this.$.layout_inbox.querySelector('paper-scroll-header-panel')) {
        this.$.layout_inbox.querySelector('paper-scroll-header-panel').notifyResize();
      }
    },

    attached() {
      if (!this.router.path || this.router.path == '/') {
        this.set('router.path', '/inbox/search/_recent_');
      }

      let _this = this;

      Tracker.autorun(() => {
        _this.set('user', Meteor.user() ? _.pick(Meteor.user().profile, ['email', 'name', 'picture', 'subscribed']) : { email: '', name: '', picture: '', subscribed: [] });
      });
    },

    is: "layout-main",

    observers: ['_layout_main_changed(route.layout_main)'],

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

  });
})();
