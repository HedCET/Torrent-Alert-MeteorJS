import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Polymer({

  attached() {
    if (this.item) {
      Meteor.subscribe('project', [this.item]);

      let _this = this;

      _this._tracker = Tracker.autorun(() => {
        _this.set('project', _project.findOne({ _id: _this.item }));
      });
    }
  },

  detached() {
    if (this._tracker) {
      this._tracker.stop();
    }
  },

  is: "project-item",

});
