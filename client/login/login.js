Template.login.events({
    'click #btnLogin': () => {
        var email = $('#emailInput').val();
        var password = $('#passwordInput').val();

            Meteor.loginWithPassword(email, password,  (err) => {
            if (err) {
                alert("Fehler: " + err, "ERROR");
            } else {
                Router.go('/');
                Tracker.flush();
            }
        });
    },
    'click #btnRegister': () => {

        var email = $('#regEmailInput').val();
        var password = $('#regPasswordInput').val();
        var name = $('#regNameInput').val();

        var user = {
            email: email,
            password: password,
            profile: {
                name: name
            }
        };

        Accounts.createUser(user, (err)  => {
            if (err) {
                alert("Fehler: " + err, "ERROR");
            } else {
                Router.go('/');
            }
        });
    }
});