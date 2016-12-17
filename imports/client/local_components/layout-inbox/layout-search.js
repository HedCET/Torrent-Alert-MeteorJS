Polymer({

  _search() {
    clearTimeout(this._search_handler ? this._search_handler : null);

    this.keyword = this.keyword.replace(/\++/g, ' ').replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/\s+/g, ' ').trim();
    let worker = this.keyword.replace(/[^0-9a-z]+/gi, '');

    if (worker) {
      var _this = this;

      _this._search_handler = setTimeout(() => {
        _this.set('query.worker', worker);
      }, 1000);
    }
  },

  _worker_changed(worker) {
    if (worker) {
      if (this.online) {
        console.log(worker);
      }
    }
  },

  attached() {
    if (!this.router.path) {
      this.set('router.path', '/');
    }

    if (!this.query.worker) {
      this.set('query.worker', '_recent_');
    }
  },

  behaviors: [Polymer.AppNetworkStatusBehavior],

  is: "layout-search",

  observers: ['_worker_changed(query.worker)'],

});
