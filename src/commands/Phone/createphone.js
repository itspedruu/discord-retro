const {Command} = require('dolphin-discord');
const Phone = require('../../classes/Phone.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'createphone',
            description: 'Setup your phone number.',
            syntax: 'createphone'
        });
    }

    async run() {
        let response = await Phone.create(this.message.author.id);

        this.message.say(`:white_check_mark: ${response.message}`);
    }
}