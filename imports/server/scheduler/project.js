import fibers from 'fibers';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { _nightmare } from '../config/nightmare.js';
import { _project } from '../../db/projects.js';
import { _torrent } from '../../db/torrents.js';
import { _worker } from '../../db/workers.js';

Meteor.setInterval(() => {
  new fibers(() => {
    Meteor.users.find({}, {
      fields: {
        'profile.subscribed': 1,
      },
    }).forEach((row) => {
      if (row.profile.subscribed && row.profile.subscribed.length) {
        row.profile.subscribed.forEach((subscribed) => {
          let project = _project.findOne(subscribed, { fields: { query: true, title: true } });

          if (project) {
            let torrent = _torrent.find({ project: project._id, user_subscribed: { $ne: row._id } }, { fields: { _id: 1 } }).fetch();

            if (torrent.length) {



              if (torrent.length < 35) {
                let worker = _worker.findOne({ query: { $options: 'i', $regex: '^' + project.query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$' } }, { fields: { status: true, time: true } });

                if (worker) {
                  if (worker.status != '200' || 3 < moment.duration(moment().diff(worker.time)).asHours()) { // SCHEDULER INTERVAL
                    _worker.update(worker._id, { $set: { status: '', time: moment().toDate() } });
                  }
                } else {
                  _worker.insert({ query: project.query, status: '', time: moment().toDate(), type: 'project' });
                }
              }
            }
          } else {
            Meteor.users.update(row._id, {
              $pull: {
                'profile.subscribed': subscribed,
              },
            });
          }
        });
      }
    });

    Meteor.setTimeout(() => { _nightmare.trigger(); });
  }).run();
}, 1000 * 60 * 15);
