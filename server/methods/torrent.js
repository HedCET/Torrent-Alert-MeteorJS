const moment = require('moment');

Meteor.methods({

  insert_torrent(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    let torrent = _torrent.findOne({
      _id: input,
    });

    if (torrent) {
      let worker = _worker.findOne({
        query: torrent.query,
      });

      if (worker) {
        if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
          _worker.update({
            _id: worker._id,
          }, {
            $set: {
              status: '',
            },
          });
        }
      } else {
        _worker.insert({
          query: torrent.query,
          status: '',
          time: moment().toDate(),
          type: 'torrent',
        });
      }

      return torrent._id;
    } else {
      throw new Meteor.Error(422, "notFound");
    }
  },

});
