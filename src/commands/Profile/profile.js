const {Command} = require('dolphin-discord');
const User = require('../../classes/User.js');
const {RichEmbed} = require('discord.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'profile',
            description: 'Displays your e-mail and phone information.',
            syntax: 'profile'
        });
    }

    async run() {
        let user = await User.getByID(this.message.author.id);

        this.message.channel.send(new RichEmbed()
            .setAuthor(`${this.message.author.username}'s Profile`, this.message.author.displayAvatarURL)
            .setColor(this.client.options.mainColor)
            .setFooter(...this.message.userFooter)
            .setTimestamp()
            .addField(':e_mail: E-mail', user.email ? `${user.email}@discordretro.com` : '**Inexistent**')
            .addField(':iphone: Phone', user.phone || '**Inexistent**')
        );
    }
}