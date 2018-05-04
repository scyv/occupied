export class Notifications {

    static _checkNotificationsAvailable() {
        return ("Notification" in window);
    }

    static _checkNotificationsAllowed() {
        return Notification.permission === "granted";
    }

    static _requestPermissionAndNotify(callback) {
        if (Notification.permission !== 'denied') {
            Notification.requestPermission((permission) => {
                if (permission === "granted") {
                    callback();
                }
            });
        }
    }

    static notify(title, message) {
        const options = {
            icon: "/favicon.png"
        };
        if (message) {
            options.body = message;
        }
        const openNotification = () => {
            new Notification(title, options);
        };
        if (!Notifications._checkNotificationsAvailable()) {
            return;
        }
        if (Notifications._checkNotificationsAllowed()) {
            openNotification();
        } else {
            Notifications._requestPermissionAndNotify(openNotification);
        }

    }
}
