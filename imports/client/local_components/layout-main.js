(function() {
  Polymer({

    _layout_main_changed(layout_main) {
      if (layout_main == 'layout-inbox' && this.$.layout_inbox.querySelector('paper-scroll-header-panel')) {
        this.$.layout_inbox.querySelector('paper-scroll-header-panel').notifyResize();
      }
    },

    attached() {
      if (!this.route.layout_main) {
        this.set('route.layout_main', 'layout-inbox');
      }
    },

    is: "layout-main",

    observers: ['_layout_main_changed(route.layout_main)'],

  });
})();
