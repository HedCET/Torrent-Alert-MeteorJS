Polymer({

  is: "polymer-spinner",

  properties: {
    opened: {
      type: Boolean,
      value: true,
    },
  },

  toggle() {
    if (this.opened) {
      let _this = this;

      _this.async(() => {
        _this.opened = !_this.opened;
      }, 400);
    } else {
      this.opened = !this.opened;
    }
  },

});
