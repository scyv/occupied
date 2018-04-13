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
    },
    updateTeam(teamId, name) {
        checkUserLoggedIn(this);
        check(teamId, String);
        check(name, String);

        Teams.update({_id: teamId, owner: this.userId}, {$set: {name: name}});
    },
    removeTeam(teamId) {
        checkUserLoggedIn(this);
        check(teamId, String);

        Teams.remove({_id: teamId});
        Resources.remove({teamId: teamId});
    },
    createResource(resource) {
        check(resource.name, String);
        check(resource.teamId, String);

        Resources.insert(resource);
    },
    updateResource(resourceId, resource) {
        check(resourceId, String);
        check(resource.name, String);
        check(resource.teamId, String);

        Resources.update({_id: resourceId, teamId: resource.teamId}, {$set: {name: resource.name}});
    },
    removeResource(resourceId) {
        checkUserLoggedIn(this);
        check(resourceId, String);

        Resources.remove({_id: resourceId});
    },
    occupyResource(resourceId, user) {
        check(resourceId, String);
        const resource = Resources.findOne({_id: resourceId});
        if (resource && !resource.occupiedBy) {
            let occupiedBy;
            let setter;
            if (this.userId) {
                const loggedInUser = Meteor.users.findOne(this.userId);
                occupiedBy = loggedInUser.profile.name;
                setter = {$set: {occupiedBy, occupiedByUser: this.userId}};
            } else {
                occupiedBy = user;
                setter = {$set: {occupiedBy}};
            }
            Resources.update({_id: resourceId}, setter);
            console.log("OCCUPIED Resource", resourceId, resource.name, "by", occupiedBy);
        }
    },
    releaseResource(resourceId, user) {
        check(resourceId, String);
        const resource = Resources.findOne({_id: resourceId});
        if (resource && resource.occupiedBy) {
            let removeAllowed = false;
            if (resource.occupiedByUser) {
                if (this.userId && resource.occupiedByUser === this.userId) {
                    removeAllowed = true;
                }
            } else {
                if (resource.occupiedBy === user) {
                    removeAllowed = true;
                }
            }

            if (removeAllowed) {
                Resources.update({_id: resourceId}, {$set: {occupiedBy: null, occupiedByUser: null}});
                console.log("RELEASED Resource", resourceId, resource.name, "from", resource.occupiedBy);
            }
        }

    }
});