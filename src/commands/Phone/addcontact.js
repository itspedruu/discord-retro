const {Command} = require('dolphin-discord');
const Phone = require('../../classes/Phone.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'addcontact',
            description: 'Add a contact to easily call someone',
            syntax: 'addcontact <phone-number> <name>',
            defaultArgs: 2
        });
    }

    async run() {
        let name = this.args.slice(1).join(' ');
        let phoneNumber = this.args[0];

        let response = await Phone.addContact(this.message.author.id, name, phoneNumber);
        this.message.say(`${response.result == 'error' ? ':no_good:' : ':white_check_mark:'} ${response.message}`);
    }
}