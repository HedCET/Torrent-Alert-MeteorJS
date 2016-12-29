const gcm = require('node-gcm');
const moment = require('moment');

Meteor.methods({

  insert_PN(input) {
    this.unblock();

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    Meteor.users.update({ _id: user._id }, {
      $addToSet: {
        PN: input,
      },
    });

    return input;
  },

  trigger_PN() {
    this.unblock();

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    if (user._id != 'ADMIN') throw new Meteor.Error(422, "userNotAllowed");

    let PN = new gcm.Sender(process.env.GCM_SERVER_KEY);

    Meteor.users.find({}, {
      fields: {
        PN: true,
        'profile.subscribed': true,
      },
    }).forEach((row) => {
      if (row.profile.subscribed && row.profile.subscribed.length) {
        row.profile.subscribed.forEach((subscribed_project) => {
          let project = _project.findOne({
            _id: subscribed_project,
          });

          if (project) {
            let un_subscribed_torrent = _torrent.find({ project: project._id, user_subscribed: { $ne: row._id } });

            if (1 <= un_subscribed_torrent.count()) {
              if (row.PN && row.PN.length) {
                let pushAlert = new gcm.Message({
                  collapseKey: 'Torrent Alert',
                  // contentAvailable: true,
                  // delayWhileIdle: true,
                  // dryRun: true,
                  data: {
                    body: un_subscribed_torrent.count() + ' newItemFound',
                    // msgcnt: 1,
                    notId: project._id,
                    project: project._id,
                    soundname: '',
                    // style: 'inbox',
                    // summaryText: 'summaryText',
                    title: project.title,
                    torrent: _.map(un_subscribed_torrent.fetch(), (torrent) => {
                      return torrent._id;
                    }),
                    vibrationPattern: [],
                  },
                  priority: 'high',
                  restrictedPackageName: 'online.linto.torrent',
                  // timeToLive: 60 * 60 * 24,
                });

                PN.send(pushAlert, { registrationTokens: row.PN }, 5, (error, res) => {
                  if (error) {
                    console.log('trigger_PN', error);
                  } else {
                    res.results.forEach((item, index) => {
                      if (item.registration_id) {
                        Meteor.users.update({
                          _id: row._id,
                        }, {
                          $addToSet: {
                            PN: item.registration_id,
                          },
                          $pull: {
                            PN: row.PN[index],
                          },
                        });
                      } else {
                        if (item.error) {
                          Meteor.users.update({
                            _id: row._id,
                          }, {
                            $pull: {
                              PN: row.PN[index],
                            },
                          });
                        }
                      }
                    });
                  }
                });
              }

              if (un_subscribed_torrent.count() < 35) {
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
                  if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asHours()) {
                    _worker.update({
                      _id: worker._id,
                    }, {
                      $set: {
                        status: '',
                        time: moment().toDate(),
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
              }
            }
          } else {
            Meteor.users.update({
              _id: row._id,
            }, {
              $pull: {
                'profile.subscribed': subscribed_project,
              },
            });
          }
        });
      }
    });

    return true;
  },

});
