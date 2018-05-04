import { Template } from "meteor/templating";
import { resourcesHandle } from "./../main";
import { teamsHandle } from "./../main";
import { Notifications } from "./../notifications";
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
    },
    releaseRequested() {
        const notified = this.releaseRequestNotified;
        const requestedAt = this.releaseRequestedAt;
        if (requestedAt && !notified
            && this.occupiedBy === getUserName()) {

            Notifications.notify("Freigabe Angefragt", this.releaseRequestedBy + " hat die Freigabe für " + this.name + " angefragt!");

            let timeLeft = 60;
            const countDownDisplay = ()=> {
                const elem = $('.time-left-' + this._id)[0];
                if (elem) {
                    timeLeft--;
                    elem.textContent = "(" + timeLeft + "s)";
                    if (timeLeft > 0) {
                        Meteor.setTimeout(countDownDisplay, 999);
                    }
                }
            };
            Meteor.setTimeout(countDownDisplay, 1000);
            Meteor.call("setReleaseRequestNotified", this._id, getUserName());
        }

        return requestedAt;
    },
    releaseRequestedBy() {
        return this.releaseRequestedBy;
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
    },
    "click .btnRequestRelease"() {
        Meteor.call("requestRelease", this._id, getUserName());
    },
    "click .btnDenyRelease"() {
        Meteor.call("denyRelease", this._id, getUserName());
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
