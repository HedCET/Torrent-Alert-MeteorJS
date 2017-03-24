import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { _project } from '../../db/projects.js';
import { _torrent } from '../../db/torrents.js';
import { _url } from '../../db/urls.js';
import { _worker } from '../../db/workers.js';

Meteor.methods({

  update_worker(input) {
    this.unblock();

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "User Not Found");

    if (['ADMIN'].indexOf(user._id) == -1) {
      throw new Meteor.Error(422, "User Not Allowed");
    }

    check(input, Object);

    switch (input.type) {

      case 'keyword':
        input.project = [];

        if (input.keyword) {
          input.keyword.forEach((keyword) => {
            keyword = keyword.replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/\s+/g, ' ').trim();

            if (keyword) {
              let query = '/search?f=' + keyword + ' added:999d seed > 0';

              let exists = _project.findOne({ query: { $options: 'i', $regex: '^' + query + '$' } }, { fields: { _id: true } });

              if (exists) {
                input.project.push(exists._id);
              } else {
                input.project.push(_project.insert({ query, title: keyword, worker: '' }));
              }
            }
          });
        }

        _worker.update(input._id, { $set: { project: input.project, status: (input.error ? input.error : '200'), time: moment().toDate() } });
        break;

      case 'project':
        let project = _project.findOne({ query: { $options: 'i', $regex: '^' + input.query + '$' } }, { fields: { _id: true } });

        if (project) {
          if (input.recent) {
            input.project = [];

            input.recent.forEach((keyword) => {
              keyword = keyword.replace(/ added.*?[0-9]+[a-z] ?/gi, ' ').replace(/ seed.*?[0-9]+ ?/gi, ' ').replace(/\s+/g, ' ').trim();

              if (keyword) {
                let query = '/search?f=' + keyword + ' added:999d seed > 0';

                let exists = _project.findOne({ query: { $options: 'i', $regex: '^' + query + '$' } }, { fields: { _id: true } });

                if (exists) {
                  input.project.push(exists._id);
                } else {
                  input.project.push(_project.insert({ query, title: keyword, worker: '' }));
                }
              }
            });

            let worker = _worker.findOne('recent', { fields: { time: true } });

            if (worker) {
              if (3 < moment.duration(moment().diff(worker.time)).asMinutes()) {
                _worker.update('recent', { $set: { project: input.project, time: moment().toDate() } });
              }
            } else {
              _worker.insert({ _id: 'recent', project: input.project, status: '200', time: moment().toDate() });
            }
          }

          if (input.torrent) {
            input.torrent.forEach((torrent) => {
              let exists = _torrent.findOne({ query: torrent.query }, { fields: { _id: true } });

              if (exists) {
                _torrent.update(exists._id, { $addToSet: { project: project._id }, $set: torrent });
              } else {
                _torrent.insert(_.extend(torrent, { project: [project._id], url: [] }));
              }

              let worker = _worker.findOne({ query: torrent.query }, { fields: { status: true, time: true } });

              if (worker) {
                if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
                  _worker.update(worker._id, { $set: { status: '', time: moment().toDate() } });
                }
              } else {
                _worker.insert({ query: torrent.query, status: '', time: moment().toDate(), type: 'torrent' });
              }
            });
          }

          if (input.torrent_count) {
            _project.update(project._id, { $set: { worker: '200', torrent_count: input.torrent_count } });
          } else {
            _project.update(project._id, { $set: { worker: (input.error ? input.error : 'No Item Found') } });
          }
        }

        _worker.update(input._id, { $set: { status: (input.error ? input.error : '200'), time: moment().toDate() } });
        break;

      case 'torrent':
        let torrent = _torrent.findOne({ query: input.query }, { fields: { _id: true } });

        if (torrent) {
          if (input.url) {
            let url = [];

            input.url.forEach((item) => {
              let exists = _url.findOne({ query: { $options: 'i', $regex: '^' + item.query + '$' } }, { fields: { _id: true } });

              if (exists) {
                url.push(exists._id);
              } else {
                url.push(_url.insert(item))
              }
            });

            _torrent.update(torrent._id, { $set: { url } });
          }
        }

        _worker.update(input._id, { $set: { status: (input.error ? input.error : '200'), time: moment().toDate() } });
        break;

    }
  },

});
