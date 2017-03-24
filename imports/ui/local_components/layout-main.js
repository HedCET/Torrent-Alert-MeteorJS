Polymer({

  attached() {
    if (!this.router.path || this.router.path == '/') {
      this.set('router.path', '/search/recent');
    }

    this.async(() => {
      // this.$.spinner.toggle();
    }, 1000 * 3);
  },

  is: 'layout-main',

});

import './layout-search/layout-search.js';
