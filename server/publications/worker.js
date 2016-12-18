Meteor.publish('worker', (input) => {
  if (this.userId == 'ADMIN') {
    check(input, Object);

    return _worker.find(input);
  } else {
    check(input, [String]);

    return _worker.find({
      _id: {
        $in: input,
      },
      deny: {
        $exists: false,
      },
    }, {
      fields: {
        response: true,
        status: true,
      },
      limit: 15,
      sort: {
        time: -1,
      },
    });
  }
});
