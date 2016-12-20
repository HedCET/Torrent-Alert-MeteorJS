import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Polymer({

  _item_changed(item) {
    if (item) {
      Meteor.subscribe('project', [item]);

      if (this._stop) {
        this._stop.stop();
      }

      let _this = this;

      _this._stop = Tracker.autorun(() => {
        _this.project = _project.findOne({
          _id: item,
        });
      });
    }
  },

  is: "project-item",

  observers: ['_item_changed(item)'],

});
