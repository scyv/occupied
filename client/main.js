import { Meteor } from "meteor/meteor"
import { Template } from "meteor/templating"
import { SessionProps} from "./sessionProperties"

export let teamsHandle;
export let resourcesHandle;

UI.registerHelper("formattedDate", (date) => {
    if (!date) {
        return "-";
    }
    return moment(date).format("DD.MM.YYYY");
});

Template.layout.events({
    "click .btn-logout"() {
        Meteor.logout();
    }
});

Meteor.startup(() => {
    moment.locale("de");

    Tracker.autorun(() => {
        const selectedTeam = Session.get(SessionProps.SELECTED_TEAM);
        teamsHandle = Meteor.subscribe("teams");
        resourcesHandle = Meteor.subscribe("resources", selectedTeam);
    });
});