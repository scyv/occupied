import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // nothing
});

Meteor.publish("teams", function (teamId) {
    if (teamId) {
        return Teams.find({_id: teamId});
    }
    return Teams.find({owner: this.userId});
});

Meteor.publish("resources", function (teamId) {
    return Resources.find({teamId});
});
