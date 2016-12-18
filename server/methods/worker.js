const moment = require('moment');

Meteor.methods({

  insert_worker(input) {
    this.unblock();

    // var user = Meteor.user();
    // if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    let row = _worker.findOne({
      query: input,
    });

    if (row) {
      if (row.status != '200' || 3 < moment.duration(moment().diff(row.time)).asDays()) {
        _worker.update({
          _id: row._id,
        }, {
          $set: {
            status: '',
          },
        });
      }

      return row._id;
    } else {
      return _worker.insert({
        query: input,
        response: [],
        status: '',
        time: moment().toDate(),
        type: 'keyword',
      });
    }
  },

});
