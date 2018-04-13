import { Meteor } from "meteor/meteor"
import { SessionProps} from "./sessionProperties"

Router.configure({
    layoutTemplate: "layout"
});

Router.route("/", function () {
    if (Meteor.userId()) {
        this.render("teams");
    } else {
        this.render("login");
    }
}, {name: "teams"});

Router.route("/login", function () {
    this.render("login");
}, {name: "login"});

Router.route("/team/:teamId", function () {
    const teamId = this.params.teamId;
    this.wait(Meteor.subscribe("teams", teamId, () => {
        Session.set(SessionProps.SELECTED_TEAM, teamId);
    }));
    if (this.ready()) {
        this.render("resources");
    } else {
        this.render("loading");
    }

}, {name: "resources"});
