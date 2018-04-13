import { Template } from "meteor/templating";
import { resourcesHandle } from "./../main";
import { teamsHandle } from "./../main";
import { SessionProps} from "./../sessionProperties"
import {ClientStorage} from 'meteor/ostrio:cstorage';


function getUserName() {
    if (Meteor.userId()) {
        return Meteor.user().profile.name;
    }
    return ClientStorage.get("userName");
}

Template.resources.helpers({
    selectedTeam() {
        return Teams.findOne(Session.get(SessionProps.SELECTED_TEAM));
    },
    resourcesLoading() {
        return !resourcesHandle.ready() || !teamsHandle.ready();
    },
    resources() {
        return Resources.find({}, {sort: {name: 1}});
    },
    state() {
        if (this.occupiedBy) {
            return "occupied";
        } else {
            return "free";
        }
    },
    occupiedBy() {
        return this.occupiedBy;
    },
    occupiedByMe() {
        return this.occupiedBy === getUserName();
    },
    userName() {
        return getUserName();
    }
});

Template.resources.events({
    "click .btnCreateResource"() {
        Session.set(SessionProps.SELECTED_RESOURCE, undefined);
        $("#dlgEditResource").modal("show");
        return false;
    },
    "click .btnEditResource"() {
        Session.set(SessionProps.SELECTED_RESOURCE, this._id);
        $("#dlgEditResource").modal("show");
        return false;
    },
    "click .btnOccupy"() {
        Meteor.call("occupyResource", this._id, getUserName());
    },
    "click .btnRelease"() {
        Meteor.call("releaseResource", this._id, getUserName());
    }
});

Template.enterUserName.helpers({
    name() {
        return getUserName();
    }
});

Template.enterUserName.events({
    "click .btnSaveUserName"() {
        const userName = $("#userNameInput").val().trim();
        if (userName !== '') {
            ClientStorage.set("userName", userName);
            window.location.reload();
        }
    }
});
