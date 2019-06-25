const {Command} = require('dolphin-discord');
const Email = require('../../classes/Email.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'blockemail',
            description: 'Block an e-mail',
            syntax: 'blockemail <email>',
            defaultArgs: 1,
            dmVersion: true
        });
    }

    async run() {
        if (!await Email.hasEmail(this.message.author.id)) return this.message.say(`:no_good: You don't have an e-mail created. Create one using \`.createemail\``);

        let matches = this.args[0].match(/\b(\w|_)+\b(?=@discordretro.com)/g);
        let emailName = matches ? matches[0] : null;
        if (!emailName) return this.message.say(`:no_good: The email you entered is not valid.`);

        let response = await Email.block(this.message.author.id, emailName);

        this.message.say(`${response.result == 'error' ? ':no_good:' : ':white_check_mark:'} ${response.message}`);
    }
}