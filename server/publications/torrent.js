Meteor.publish('torrent', function(input) {
  check(input, Match.OneOf({ page: Number, project: [String] }, { project: [String], torrent: [String] }, { torrent: [String] }));

  let A = _torrent.find(_.extend({ deny: { $exists: false } }, (input.project ? { project: { $in: input.project } } : {}), (input.torrent ? { _id: { $in: input.torrent } } : {}), (this.userId ? { user_removed: { $ne: this.userId } } : {})), {
    fields: {
      deny: false,
      user_removed: false,
      user_subscribed: false,
    },
    limit: 15,
    skip: Math.abs(15 * (input.page - 1)),
    sort: {
      time: -1,
    },
  });

  if (this.userId) {
    _torrent.update({
      _id: {
        $in: _.map(A.fetch(), (Z) => {
          return Z._id;
        }),
      },
    }, {
      $addToSet: {
        user_subscribed: this.userId,
      },
    }, {
      multi: true,
    });
  }

  return A;
});
