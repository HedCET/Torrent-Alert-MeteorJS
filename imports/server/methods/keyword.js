import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { _worker } from '../../db/workers.js';

Meteor.methods({

  'insert.keyword'(input) {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(400, 'User Not Found');

    check(input, String);

    let query = '/suggestions.php?q=' + input;

    let worker = _worker.findOne({ query: { $options: 'i', $regex: '^' + query + '$' } }, { fields: { status: true, time: true } });

    if (worker) {
      if (worker.status != '200' || 3 < moment.duration(moment().diff(worker.time)).asDays()) {
        _worker.update(worker._id, { $set: { status: '', time: moment().toDate() } });
      }

      return worker._id;
    } else {
      return _worker.insert({ project: [], query, status: '', time: moment().toDate(), type: 'keyword' });
    }
  },

});
