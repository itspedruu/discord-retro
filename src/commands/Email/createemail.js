const {Command} = require('dolphin-discord');
const Email = require('../../classes/Email.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'createemail',
            description: 'Setup your e-mail. Don\'t include @ in the email-name. Example of email-name: xgrow',
            syntax: 'createemail <email-name>',
            defaultArgs: 1
        });
    }

    async run() {
        let response = await Email.create(this.message.author.id, this.args[0]);

        this.message.say(`${response.result == 'error' ? ':no_good:' : ':white_check_mark:'} ${response.message}`);
    }
}