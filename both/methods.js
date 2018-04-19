import { Meteor } from 'meteor/meteor'
import { check } from "meteor/check";

if (Meteor.isServer) {
    var MattermostApi = require('../server/mattermost-api').MattermostApi;
}

function checkUserLoggedIn(ctx) {
    if (!ctx.userId) {
        throw Meteor.error("Unauthorized", 403);
    }
}

function sendMatterMostMessage(resource, occupiedBy, action) {
    if (resource.mattermostUrl) {
        const mmApi = new MattermostApi("OccupiedBot", resource.mattermostUrl);
        switch (action) {
            case "OCCUPIED":
                mmApi.send(occupiedBy + " hat " + resource.name + " belegt");
                break;
            case "RELEASED":
                mmApi.send(occupiedBy + " hat " + resource.name + " freigegeben");
                break;
            case "RELEASE_FORCED":
                mmApi.send(resource.name + " wurde freigegeben");
                break;
        }
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
        check(resource.mattermostUrl, String);
        check(resource.teamId, String);

        Resources.insert({
            name: resource.name,
            mattermostUrl: resource.mattermostUrl,
            teamId: resource.teamId
        });
    },
    updateResource(resourceId, resource) {
        check(resourceId, String);
        check(resource.name, String);
        check(resource.mattermostUrl, String);
        check(resource.teamId, String);

        Resources.update({_id: resourceId, teamId: resource.teamId}, {
            $set: {
                name: resource.name,
                mattermostUrl: resource.mattermostUrl
            }
        });
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

            if (!this.isSimulation) {
                sendMatterMostMessage(resource, occupiedBy, "OCCUPIED");
            }

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

                if (!this.isSimulation) {
                    sendMatterMostMessage(resource, resource.occupiedBy, "RELEASED");
                }

                console.log("RELEASED Resource", resourceId, resource.name, "from", resource.occupiedBy);
            }
        }
    },
    forceRelease(resourceId) {
        if (this.userId) {
            check(resourceId, String);
            const resource = Resources.findOne({_id: resourceId});
            if (resource && resource.occupiedBy) {
                Resources.update({_id: resourceId}, {$set: {occupiedBy: null, occupiedByUser: null}});
                if (!this.isSimulation) {
                    sendMatterMostMessage(resource, resource.occupiedBy, "RELEASE_FORCED");
                }
                console.log("RELEASED Resource", resourceId, resource.name, "from", resource.occupiedBy);
            }
        }
    }
});