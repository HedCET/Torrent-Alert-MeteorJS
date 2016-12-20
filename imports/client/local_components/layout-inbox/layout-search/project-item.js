import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Polymer({

  _item_changed(item) {
    if (item) {
      let _this = this;

      Tracker.autorun(() => {
        Tracker.autorun(() => {
          Meteor.subscribe('project', [item]);
        });
      });

      Tracker.autorun(() => {
        _this.project = _project.findOne({
          _id: item,
        });
      });
    }
  },

  is: "project-item",

  observers: ['_item_changed(item)'],

});
