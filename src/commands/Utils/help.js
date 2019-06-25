const {RichEmbed} = require('discord.js');
const {Command} = require('dolphin-discord');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'help',
            description: 'Displays the commands list',
            syntax: 'help',
            dmVersion: true
        });
    }

    async run() {
        let categories = [
            {"key": "Email", "emoji": "✉"},
            {"key": "Phone", "emoji": "📱"},
            {"key": "Profile", "emoji": "👤"},
            {"key": "Utils", "emoji": "⚙"}
        ]

        let getPage = (mainMenu = true, categoryKey) => {
            if (mainMenu) {
                let description = categories.map(category => `${category.emoji} ${category.key}`).join('\n\n');
                
                return new RichEmbed()
                    .setAuthor('Choose one category by reacting', this.client.user.displayAvatarURL)
                    .setColor(this.client.options.mainColor)
                    .setDescription(description)
                    .setTimestamp()
            } else {
                let commands = this.client.commands.filter(command => command.category == categoryKey);
                let commandsText = commands.map(command => `[\`${command.syntax}\`](${this.client.config.mainLink}) **»** ${command.description}`).join('\n\n');
    
                return new RichEmbed()
                    .setAuthor(`Commands list of ${categoryKey}`, this.client.user.displayAvatarURL)
                    .setColor(this.client.options.mainColor)
                    .setDescription(`Use :card_box: to return.\n\n${commandsText}`)
                    .setTimestamp()
                    .setFooter('[parameter] = Optional | <parameter> = Required', this.client.user.displayAvatarURL)
            }
        }

        let channel;

        try {
            channel = await this.message.author.createDM();

            this.message.say(':mailbox_with_mail: Check your private messages.');
        } catch (err) {
            channel = this.message.channel;
        }
    
        let message = await channel.send(getPage());
    
        let categoryEmojis = categories.map(category => category.emoji);
        let reactions = ['🗃', ...categoryEmojis, '🚫'];
    
        let filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id == this.message.author.id;
        let collector = await message.createReactionCollector(filter, {time: 300000});
    
        collector.on('collect', async reaction => {
            if (reaction.emoji.name == '🚫') return collector.stop();
    
            if (reaction.emoji.name == '🗃') return await message.edit(getPage());
    
            let categoryKey = categories.find(category => category.emoji == reaction.emoji.name).key;
            await message.edit(getPage(false, categoryKey));
        });

        collector.on('end', async () => {
            if (!message.deleted) await message.delete();
        });

        for (let reaction of reactions) await message.react(reaction);
    }
}