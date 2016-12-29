const gcm = require('node-gcm');

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

    return input;
  },

  trigger_PN() {
    this.unblock();

    // let user = Meteor.user();
    // if (!user) throw new Meteor.Error(422, "userNotFound");

    // if (user._id != 'ADMIN') throw new Meteor.Error(422, "userNotAllowed");

    let sender = new gcm.Sender(process.env.GCM_SERVER_KEY);

    Meteor.users.find({}, {
      fields: {
        PN: true,
        'profile.subscribed': true,
      },
    }).forEach((row) => {
      console.log(row);
    });

    let message = new gcm.Message({
      collapseKey: 'Torrent Alert',
      // contentAvailable: true,
      // delayWhileIdle: true,
      // dryRun: true,
      data: {
        body: '1 newItemFound',
        // msgcnt: 1,
        notId: 'linto',
        project: 'gbRDkXr6R3FnGE4iz',
        // style: 'inbox',
        // summaryText: 'summaryText',
        title: 'malayalam',
        torrent: ['QwiT2ixPDp2CKwEBB', '4K9cqme2rQk3hQwTt'],
      },
      priority: 'high',
      restrictedPackageName: 'online.linto.torrent',
      // timeToLive: 60 * 60 * 24,
    });

    let registrationTokens = [
      "eGd1IYt0Ubk:APA91bFzM6cxqU6J85qBfDwmu3fyP_AAGLvbwq0QLYulmw8RMANLpgzA1GBoTfOdfrZaxwqBgKShjTRBjQZHa4Tdd3hwBZDbHTLy3RBwraat9jZ0-C51rG7GaVH_VHPO63yi9JWPSxsx"
    ];

    sender.send(message, { registrationTokens: registrationTokens }, 5, function(error, res) {
      if (error) {
        console.error(error);
      } else {
        console.log(res);
      }
    });

    // QUEUE

    return true;
  },

});
