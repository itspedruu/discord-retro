const {Command} = require('dolphin-discord');
const Phone = require('../../classes/Phone.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'unblockphone',
            description: 'Unblock a phone number',
            syntax: 'unblockphone <phone-number>',
            defaultArgs: 1,
            dmVersion: true
        });
    }

    async run() {
        if (!await Phone.hasPhone(this.message.author.id)) return this.message.say(`:no_good: You don't have a phone number. Create one using \`.createphone\``);

        let response = await Phone.unblock(this.message.author.id, this.args[0]);

        this.message.say(`${response.result == 'error' ? ':no_good:' : ':white_check_mark:'} ${response.message}`);
    }
}