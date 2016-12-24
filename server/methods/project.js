const moment = require('moment');

Meteor.methods({

  insert_project(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    let project = _project.findOne({
      _id: input,
    });

    if (project) {
      _project.update({
        _id: project._id,
      }, {
        $set: {
          error: '',
        },
      });

      let worker = _worker.findOne({
        query: project.query,
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
          query: project.query,
          status: '',
          time: moment().toDate(),
          type: 'project',
        });
      }

      return project._id;
    } else {
      throw new Meteor.Error(422, "notFound");
    }
  },

});
