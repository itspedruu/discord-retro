const {Command} = require('dolphin-discord');
const Phone = require('../../classes/Phone.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'public',
            syntax: 'Turn your phone number public',
            description: 'public'
        });
    }

    async run() {
        if (!await Phone.hasPhone(this.message.author.id)) return this.message.say(`:no_good: You don't have a phone number. Create one using \`.createphone\``);

        let response = await Phone.togglePublic(this.message.author.id);
        this.message.say(`:white_check_mark: ${response.message}`);
    }
}