import { Template } from 'meteor/templating';
import { teamsHandle } from './../main';
import { SessionProps} from "./../sessionProperties"


Template.teams.helpers({
    teamsLoading() {
        return !teamsHandle.ready();
    },
    teams() {
        return Teams.find();
    }
});

Template.teams.events({
    'click .btnCreateTeam'() {
        Session.set(SessionProps.SELECTED_TEAM, undefined);
        $('#dlgEditTeam').modal('show');
        return false;
    },
    'click .btnEditTeam'() {
        Session.set(SessionProps.SELECTED_TEAM, this._id);
        $('#dlgEditTeam').modal('show');
        return false;
    },
    'click .btnOpenTeams'() {
        Router.go('teams', {teamId: this._id});
        return false;
    },
    'click tr.teamRow'() {
        Router.go('teams', {teamId: this._id});
    }
});