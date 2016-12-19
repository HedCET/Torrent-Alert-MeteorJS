const moment = require('moment');

Meteor.methods({

  insert_keyword(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    input = '/suggestions.php?q=' + input;

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
        project: [],
        query: input,
        status: '',
        time: moment().toDate(),
        type: 'keyword',
      });
    }
  },

});
