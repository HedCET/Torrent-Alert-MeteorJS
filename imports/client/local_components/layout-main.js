(function() {
  Polymer({

    _layout_main_changed(layout_main) {
      if (layout_main == 'layout-inbox' && this.$.layout_inbox.querySelector('paper-scroll-header-panel')) {
        this.$.layout_inbox.querySelector('paper-scroll-header-panel').notifyResize();
      }
    },

    attached() {
      if (!this.router.path || this.router.path == '/') {
        this.set('router.path', '/inbox');
      }
    },

    is: "layout-main",

    observers: ['_layout_main_changed(route.layout_main)'],

  });
})();
