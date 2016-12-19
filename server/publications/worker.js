Meteor.publish('worker', function(input) {
  if (this.userId == 'ADMIN' && Object.prototype.toString.call(input) == '[object Object]') {
    return _worker.find(input.query, input.option);
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
        response: (true),
        status: true,
      },
      limit: 15,
      sort: {
        time: -1,
      },
    });
  }
});
