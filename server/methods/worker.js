const moment = require('moment');

Meteor.methods({

  update_worker(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    if (user._id == 'ADMIN') {

    } else {
      throw new Meteor.Error(422, "userNotAllowed");
    }
  },

});
