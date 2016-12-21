(function() {
  Polymer({

    attached() {
      if (!this.router.path) {
        this.set('router.path', '/torrent');
      }
    },

    is: "layout-z",

  });
})();
