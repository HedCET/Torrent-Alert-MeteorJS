import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { _project } from '../../db/projects.js';

Meteor.methods({

  insert_project(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, 'User Not Found');

    check(input, { query: String, title: String });

    let project = _project.findOne({ query: { $options: 'i', $regex: '^' + input.query + '$' } }, { fields: { query: true, worker: true } });

    if (project) {
      let worker = _worker.findOne({ query: { $options: 'i', $regex: '^' + project.query + '$' } }, { fields: { status: true, time: true } });

      if (worker) {
        if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
          _project.update(project._id, { $set: { worker: '' } });
          _worker.update(worker._id, { $set: { status: '', time: moment().toDate() } });
        }
      } else {
        _project.update(project._id, { $set: { worker: '' } });
        _worker.insert({ query: project.query, status: '', time: moment().toDate(), type: 'project' });
      }

      return project._id;
    } else {
      let _id = _project.insert(_.extend(input, { worker: '' }));
      _worker.insert({ query: input.query, status: '', time: moment().toDate(), type: 'project' });

      return _id;
    }
  },

  trigger_project(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, 'User Not Found');

    check(input, String);

    let project = _project.findOne({ _id: input }, { fields: { query: true, worker: true } });

    if (project) {
      let worker = _worker.findOne({ query: { $options: 'i', $regex: '^' + project.query + '$' } }, { fields: { status: true, time: true } });

      if (worker) {
        if (worker.status != '200' || 1 < moment.duration(moment().diff(worker.time)).asDays()) {
          _project.update(project._id, { $set: { worker: '' } });
          _worker.update(worker._id, { $set: { status: '', time: moment().toDate() } });
        }
      } else {
        _project.update(project._id, { $set: { worker: '' } });
        _worker.insert({ query: project.query, status: '', time: moment().toDate(), type: 'project' });
      }

      return project._id;
    } else {
      throw new Meteor.Error(400, 'Project Not Found');
    }
  },

});
