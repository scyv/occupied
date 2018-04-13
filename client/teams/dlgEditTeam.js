import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { SessionProps} from "./../sessionProperties"

Template.dlgEditTeam.helpers({
    team() {
        const selectedTeam = Session.get(SessionProps.SELECTED_TEAM);
        if (selectedTeam) {
            return Teams.findOne({_id: selectedTeam});
        }
        return {name: undefined};
    }
});

Template.dlgEditTeam.events({
    'click .btnSaveTeam'() {
        const name = $('#teamNameInput').val();
        if (this._id) {
            Meteor.call('updateTeam', this._id, name);
        } else {
            Meteor.call('createTeam', name);
        }
        $('#dlgEditTeam').modal('hide');
    },
    'click .btnDelete'() {
        if (confirm("Wirklich löschen?")) {
            Meteor.call('removeTeam', this._id);
            $('#dlgEditTeam').modal('hide');
        }
    }
});

$(document).on('shown.bs.modal', '#dlgEditTeam', () => {
    $('#teamNameInput').focus();
});