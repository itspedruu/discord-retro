const {Command} = require('dolphin-discord');
const Email = require('../../classes/Email.js');
const {RichEmbed} = require('discord.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'inbox',
            description: 'Displays your e-mail inbox',
            syntax: 'inbox'
        });
    }

    async run() {
        if (!await Email.hasEmail(this.message.author.id)) return this.message.say(`:no_good: You don't have an e-mail created. Create one using \`.createemail\``);

        let email = await Email.getByUserID(this.message.author.id);

        if (email.inbox.length == 0) return this.message.say(`:cry: You have no new e-mails.`);

        const getPage = (item, pageNumber) => {
            return new RichEmbed()
                .setAuthor(`${this.message.author.username}'s E-mails`, this.message.author.displayAvatarURL)
                .setColor(this.client.options.mainColor)
                .setFooter(`Page ${pageNumber}/${email.inbox.length}`, this.client.user.displayAvatarURL)
                .setTimestamp()
                .setDescription(`**From:** \`${item.from}@discordretro.com\`\n\n${item.content}`);
        }

        this.createPagination({items: email.inbox, removeReactions: true, getPage: getPage, userID: this.message.author.id});
    }
}