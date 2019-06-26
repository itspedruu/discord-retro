const Phone = require('../../classes/Phone.js');
const {Command} = require('dolphin-discord');
const {RichEmbed} = require('discord.js');
const utils = require('../../../utils/utils.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'callhistory',
            description: 'Displays your call history',
            syntax: 'callhistory'
        });
    }

    async run() {
        if (!await Phone.hasPhone(this.message.author.id)) return this.message.say(`:no_good: You don't have a phone number. Create one using \`.createphone\``);

        let phone = await Phone.getByUserID(this.message.author.id);
        if (phone.history.length == 0) return this.message.say(`:cry: You don't have any phone call on your history.`);

        const getPage = (item, pageNumber) => {
            return new RichEmbed()
                .setAuthor(`${this.message.author.username}'s Contacts`, this.message.author.displayAvatarURL)
                .setColor(this.client.options.mainColor)
                .setFooter(`Page ${pageNumber}/${phone.history.length}`, this.client.user.displayAvatarURL)
                .setTimestamp(item.timestamp)
                .setDescription(`You had a call with **${item.caller}** that lasted for **${utils.format(item.duration)}**`);
        }

        this.createPagination({items: phone.history, getPage: getPage, userID: this.message.author.id});
    }
}