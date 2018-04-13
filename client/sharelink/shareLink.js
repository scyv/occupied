import { Template } from 'meteor/templating';

Template.shareLink.helpers({
    currentLink() {
        const url = Router.current().originalUrl;
        return url.startsWith('http') ? url : (location.origin + url);
    }
});
