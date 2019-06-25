const {Command} = require('dolphin-discord');
const Email = require('../../classes/Email.js');
const {RichEmbed} = require('discord.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'sent',
            description: 'Displays your sent e-mails',
            syntax: 'sent'
        });
    }

    async run() {
        if (!await Email.hasEmail(this.message.author.id)) return this.message.say(`:no_good: You don't have an e-mail created. Create one using \`.createemail\``);

        let email = await Email.getByUserID(this.message.author.id);

        if (email.sent.length == 0) return this.message.say(`:cry: You have no sent e-mails.`);
        
        let currentCollector = this.client.collectors.get(this.message.author.id);
        if (currentCollector) await currentCollector.stop();

        let items = email.sent;
        let currentItem = 0;

        const getPage = item => {
            return new RichEmbed()
                .setAuthor(`${this.message.author.username}'s Sent E-mails`, this.message.author.displayAvatarURL)
                .setColor(this.client.options.mainColor)
                .setFooter(`Page ${currentItem + 1}/${items.length}`, this.client.user.displayAvatarURL)
                .setTimestamp(item.sentTimestamp)
                .setDescription(`Use :heavy_minus_sign: to delete the e-mail from your sent e-mails.\n\n**To:** \`${item.to}@discordretro.com\`\n\n${item.content}`);
        }

        let message = await this.message.channel.send(getPage(items[0]));

        let reactions = items.length == 1 ? ['➖', '🚫'] : ['◀', '➖', '▶', '🚫'];
        let filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id == this.message.author.id;
        let collector = message.createReactionCollector(filter);

        this.client.collectors.set(this.message.author.id, collector);

        collector.on('collect', async reaction => {
            if (reaction.emoji.name == '🚫') return collector.stop();

            await reaction.remove(this.message.author.id);

            if (reaction.emoji.name == '◀') {
                currentItem = currentItem - 1 < 0 ? items.length - 1 : currentItem - 1;
            } else if (reaction.emoji.name == '▶') {
                currentItem = (currentItem + 1) % items.length;
            } else {
                items = await Email.removeFromSent(this.message.author.id, currentItem);

                if (items.length == 0) return collector.stop();

                currentItem = 0;
            }

            await message.edit(getPage(items[currentItem]));
        });

        collector.on('end', async () => {
            if (!message.deleted) await message.delete();
            this.client.collectors.delete(this.message.author.id);
        });

        for (let reaction of reactions) {
            if (!message.deleted) await message.react(reaction);
        }
    }
}