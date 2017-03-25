import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const _worker = new Meteor.Collection("workers");

if (Meteor.isServer) {
  _worker._ensureIndex({ input: 1, status: 1, type: 1 });

  Meteor.publish('worker', function (input) {
    if (-1 < ['ADMIN'].indexOf(this.userId) && Match.test(input, { opt: Object, query: Object })) {
      return _worker.find(input.query, input.opt);
    } else {
      check(input, [String]); return _worker.find({ _id: { $in: input }, deny: { $exists: false } }, { fields: { project: true, query: true, status: true }, limit: 15, sort: { time: -1 } });
    }
  });
}
