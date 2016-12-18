Meteor.publish('url', (input) => {
  check(input, [String]);

  return _url.find({
    torrent: {
      $in: input,
    },
    deny: {
      $exists: false,
    },
  }, {
    fields: {
      deny: false,
    },
    limit: 15,
    sort: {
      ping: -1,
    },
  });
});
