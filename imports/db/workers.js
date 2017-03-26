import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const _worker = new Meteor.Collection("workers");

if (Meteor.isServer) {
  _worker._ensureIndex({ input: 1, status: 1, type: 1 });

  Meteor.publish('worker', function (input) {
    check(input, [String]); return _worker.find({ _id: { $in: input }, deny: { $exists: false } }, { fields: { project: true, query: true, status: true }, limit: 15, sort: { time: -1 } });
  });
}
