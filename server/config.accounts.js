Accounts.config({
  loginExpirationInDays: null,
});

Meteor.methods({

  insert_PN(input) {
    this.unblock();

    let user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    Meteor.users.update({ _id: user._id }, {
      $addToSet: {
        PN: input,
      },
    });

    return true;
  },

});
