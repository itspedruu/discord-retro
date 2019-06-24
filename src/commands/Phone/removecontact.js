const {Command} = require('dolphin-discord');
const Phone = require('../../classes/Phone.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'removecontact',
            description: 'Remove a contact from your saved contacts',
            syntax: 'removecontact <phone-number>',
            defaultArgs: 1
        });
    }

    async run() {
        let phoneNumber = this.args[0];

        let response = await Phone.removeContact(this.message.author.id, phoneNumber);
        this.message.say(`${response.result == 'error' ? ':no_good:' : ':white_check_mark:'} ${response.message}`);
    }
}