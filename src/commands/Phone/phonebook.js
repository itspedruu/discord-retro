const Phone = require('../../classes/Phone.js');
const {Command} = require('dolphin-discord');
const utils = require('../../../utils/utils.js');
const {RichEmbed} = require('discord.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'phonebook',
            description: 'Displays public phones',
            syntax: 'phonebook'
        });
    }

    async run() {
        let publicPhones = await Phone.getPublicPhoneNumbers();
        if (publicPhones.length == 0) return this.message.say(`:cry: There isn't any public number at the moment. Turn your phone number public using \`.public\``);

        let pages = utils.pagify(publicPhones, 10);

        const getPage = (page, pageNumber) => {
            let description = page.map(phoneNumber => `:iphone: **${phoneNumber}**`);
    
            return new RichEmbed()
                .setAuthor(`Phone Book`, this.client.user.displayAvatarURL)
                .setColor(this.client.options.mainColor)
                .setFooter(`Page ${pageNumber}/${pages.length}`, this.client.user.displayAvatarURL)
                .setTimestamp()
                .setDescription(description);
        }

        this.createPagination({items: pages, getPage: getPage, userID: this.message.author.id});
    }
}