import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Polymer({

  attached() {
    if (this.item) {
      Meteor.subscribe('project', [this.item]);

      let _this = this;

      _this._stop = Tracker.autorun(() => {
        _this.project = _project.findOne({
          _id: _this.item,
        });
      });
    }
  },

  detached() {
    if (this._stop) {
      this._stop.stop();
    }
  },

  is: "project-item",

  observers: ['_item_changed(item)'],

});
