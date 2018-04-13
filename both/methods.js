import { Meteor } from 'meteor/meteor'
import { check } from "meteor/check";

function checkUserLoggedIn(ctx) {
    if (!ctx.userId) {
        throw Meteor.error("Unauthorized", 403);
    }
}

Meteor.methods({
    createTeam(name) {
        checkUserLoggedIn(this);
        check(name, String);

        Teams.insert({name: name, owner: this.userId});
    }
});