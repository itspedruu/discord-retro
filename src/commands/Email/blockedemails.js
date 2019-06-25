const Email = require('../../classes/Email.js');
const {Command} = require('dolphin-discord');
const utils = require('../../../utils/utils.js');
const {RichEmbed} = require('discord.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'blockedemails',
            description: 'Displays your blocked e-mails',
            syntax: 'blockedemails'
        });
    }

    async run() {
        if (!await Email.hasEmail(this.message.author.id)) return this.message.say(`:no_good: You don't have an e-mail. Create one using \`.createemail\``);

        let email = await Email.getByUserID(this.message.author.id);
        if (email.blocked.length == 0) return this.message.say(`:cry: You don't have any e-mail blocked.`);

        let pages = utils.pagify(email.blocked, 10);

        const getPage = (page, pageNumber) => {
            let description = page.map(emailName => `:no_entry: **${emailName}@discordretro.com**`);
    
            return new RichEmbed()
                .setAuthor(`${this.message.author.username}'s Blocked E-mails`, this.message.author.displayAvatarURL)
                .setColor(this.client.options.mainColor)
                .setFooter(`Page ${pageNumber}/${pages.length}`, this.client.user.displayAvatarURL)
                .setTimestamp()
                .setDescription(description);
        }

        this.createPagination({items: pages, getPage: getPage, userID: this.message.author.id});
    }
}