export class MattermostApi {

    constructor(botName, hookUrl) {
        this.botName = botName;
        this.hookUrl = hookUrl;
    }

    onError(err) {
        console.error(err);
    }

    send(text) {
        var data = {
            "username": this.botName,
            "text": text
        };
        HTTP.call("POST", this.hookUrl, {
            headers: {"Content-Type": "application/json"},
            data: data
        }, function (err) {
            if (err) {
                this.onError(err);
            }
        });
    }

}