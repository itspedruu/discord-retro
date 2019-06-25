const {Command} = require('discord.js');
const Phone = require('../../classes/Phone.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'anonymous',
            syntax: 'Toggle anonymous mode for phone calls',
            description: 'anonymous'
        });
    }

    async run() {
        if (!await Phone.hasPhone(this.message.author.id)) return this.message.say(`:no_good: You don't have a phone number. Create one using \`.createphone\``);

        let response = await Phone.toggleAnonymous(this.message.author.id);
        this.message.say(`:white_check_mark: ${response.message}`);
    }
}