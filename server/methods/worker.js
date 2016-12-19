const moment = require('moment');

Meteor.methods({

  update_worker(input) {
    this.unblock();

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    if (user._id != 'ADMIN') throw new Meteor.Error(422, "userNotAllowed");

    switch (input.type) {

      case 'keyword':
        input.project = [];

        if (input.keyword) {
          input.keyword.forEach((keyword) => {
            keyword = keyword.replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/\s+/g, ' ').trim();

            let query = '/search?f=' + keyword + ' seed > 0 added:60d';

            let project = _project.findOne({
              query: query,
            });

            if (project) {
              input.project.push(project._id);

              let worker = _worker.findOne({
                query: query,
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
                  query: query,
                  status: '',
                  time: moment().toDate(),
                  type: 'project',
                });
              }
            } else {
              input.project.push(_project.insert({ query: query, title: keyword }));

              _worker.insert({
                query: query,
                status: '',
                time: moment().toDate(),
                type: 'project',
              });
            }
          });
        }

        _worker.update({
          _id: input._id,
        }, {
          $set: {
            project: input.project,
            status: (input.error ? input.error : '200'),
          },
        });
        break;

    }
  },

});
