import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { SessionProps} from "./../sessionProperties"

const getSelectedResource = () => {
    const selectedResourceId = Session.get(SessionProps.SELECTED_RESOURCE);
    let resource = undefined;
    if (selectedResourceId) {
        resource = Resources.findOne({_id: selectedResourceId});
    }
    return resource;
};

Template.dlgEditResource.helpers({
    resource() {
        const resource = getSelectedResource();
        if (resource) {
            return resource;
        }
        return {name: ''};
    }
});

Template.dlgEditResource.events({
    'click .btnSaveResource'() {
        const name = $('#resourceNameInput').val();
        const mattermostUrl = $('#mattermostHookUrlInput').val();
        const teamId = Session.get(SessionProps.SELECTED_TEAM);

        const obj = {name, mattermostUrl, teamId};

        if (this._id) {
            Meteor.call("updateResource", this._id, obj);
        } else {
            Meteor.call("createResource", obj);
        }
        $('#dlgEditResource').modal('hide');
    },
    'click .btnDelete'() {
        if (confirm("Wirklich löschen?")) {
            Meteor.call('removeResource', this._id);
            $('#dlgEditResource').modal('hide');
        }
    }
});

$(document).on('shown.bs.modal', '#dlgEditResource', () => {
    $('#resourceNameInput').focus();
});

