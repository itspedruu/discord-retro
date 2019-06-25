const {Command} = require('dolphin-discord');
const Email = require('../../classes/Email.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'send',
            description: 'Send an e-mail to someone',
            syntax: 'send',
            defaultArgs: 1,
            dmVersion: true
        });
    } 

    async run() {
        if (!await Email.hasEmail(this.message.author.id)) return this.message.say(`:no_good: You don't have an e-mail created. Create one using \`.createemail\``);

        let matches = this.args[0].match(/\b(\w|_)+\b(?=@discordretro.com)/g);
        let emailName = matches.length == 0 ? null : matches[0];
        if (!await Email.exists(emailName)) return this.message.say(`:cry: Sorry! I couldn't find that e-mail.`);

        this.message.say(`:email: Type your message or cancel it typing **cancel**.\n\n**MAX CHARACTERS:** \`1950\``);

        let from = await Email.getByUserID(this.message.author.id)

        let filter = message => message.author.id == this.message.author.id;
        this.message.channel.awaitMessages(filter, {max: 1}).then(async collected => {
            let content = collected.first().content;
            if (content.toLowerCase() == 'cancel') return this.message.say(`:white_check_mark: Cancelled your action.`);
            if (content.length > 1950) return this.message.say(`:cry: Sorry! Your message exceded **1950 characters**.`);
            
            await Email.send(from, emailName, content);
            this.message.say(`:email: You've sent an e-mail to \`${emailName}@discordretro.com\``)
        }).catch(err => {
            console.log(err);
            this.message.say(`:no_good: Unexpected error has occurred. Try again!`);
        });
    }
}