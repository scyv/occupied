import { Template } from "meteor/templating";
import { resourcesHandle } from "./../main";
import { teamsHandle } from "./../main";
import { SessionProps} from "./../sessionProperties"

Template.resources.helpers({
    selectedTeam() {
        return Team.findOne(Session.get(SessionProps.SELECTED_TEAM));
    },
    resourcesLoading() {
        return !resourcesHandle.ready() || !teamsHandle.ready();
    },
    resources() {
        return Resources.find({}, {sort: {name: 1}});
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
    }
});
