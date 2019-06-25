const Phone = require('../../classes/Phone.js');
const {Command} = require('dolphin-discord');
const utils = require('../../../utils/utils.js');
const {RichEmbed} = require('discord.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'blockedphones',
            description: 'Displays your blocked phones',
            syntax: 'blockedphones'
        });
    }

    async run() {
        if (!await Phone.hasPhone(this.message.author.id)) return this.message.say(`:no_good: You don't have a phone number. Create one using \`.createphone\``);

        let phone = await Phone.getByUserID(this.message.author.id);
        if (phone.blocked.length == 0) return this.message.say(`:cry: You don't have any phone number blocked.`);

        let pages = utils.pagify(phone.blocked, 10);

        const getPage = (page, pageNumber) => {
            let description = page.map(phoneNumber => `:no_entry: **${phoneNumber}**`);
    
            return new RichEmbed()
                .setAuthor(`${this.message.author.username}'s Blocked Phone Numbers`, this.message.author.displayAvatarURL)
                .setColor(this.client.options.mainColor)
                .setFooter(`Page ${pageNumber}/${pages.length}`, this.client.user.displayAvatarURL)
                .setTimestamp()
                .setDescription(description);
        }

        this.createPagination({items: pages, getPage: getPage, userID: this.message.author.id});
    }
}