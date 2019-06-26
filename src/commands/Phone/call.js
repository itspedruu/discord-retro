const {Command} = require('dolphin-discord');
const Phone = require('../../classes/Phone.js');
const User = require('../../classes/User.js');
const {RichEmbed} = require('discord.js');
const utils = require('../../../utils/utils.js');

module.exports = class DolphinCommand extends Command {
    constructor() {
        super({
            name: 'call',
            description: 'Call someone from your contact list or by the phone number',
            syntax: 'call <phone-number|contact-name>',
            defaultArgs: 1,
            dmVersion: true
        });
    }

    async run() {
        if (!this.message.dmVersion) return this.message.say(`:no_entry: You need to execute this command in the private messages.`);

        if (!await Phone.hasPhone(this.message.author.id)) return this.message.say(`:no_good: You don't have a phone number. Create one using \`.createphone\``);

        let phoneNumber = await Phone.validatePhoneNumber(this.args[0]) ? this.args[0] : await Phone.getContact(this.message.author.id, this.args[0]);
        if (!phoneNumber) return this.message.say(`:no_good: That's not a valid phone number.`);

        let receiverPhone = await Phone.getByPhoneNumber(phoneNumber);
        let receiver = this.client.users.get(receiverPhone.userID);

        if (await User.isInCall(this.message.author.id)) return this.message.say(`:no_good: You are currently in a phone call.`);

        if (!receiver) return this.message.say(`:cry: Sorry! **${phoneNumber}** is unreachable.`);
        if (receiver.id == this.message.author.id) return this.message.say(`:thinking: Do you want to call yourself? Are you that lonely?`);
        if (!await Phone.canCall(receiver.id, this.message.author.id)) return this.message.say(`:cry: Sorry! The person you tried to call is currently unavailable.`);

        try {
            await receiver.createDM();
        } catch (err) {
            return this.message.say(`:cry: Sorry! The person you tried to call is currently unavailable.`);
        }

        let caller = await Phone.getByUserID(this.message.author.id);

        this.message.say(`:iphone: You started calling \`${phoneNumber}\``);

        let message = await receiver.send(new RichEmbed()
            .setDescription(`${caller.anonymous ? 'An anonymous caller' : `**${this.message.author.username}**`} is calling you. Do you accept it?`)
            .setColor(this.client.options.mainColor)
            .setFooter(`You have 2 minutes to accept it.`)
        );

        let reactions = ['✅', '❎'];

        let filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id == receiver.id;
        message.awaitReactions(filter, {time: 120000, max: 1}).then(async collected => {
            let accepted = !!collected.get('✅');
            let timeOver = !accepted && !collected.get('❎');

            await message.delete();

            if (accepted) {
                if (await User.isInCall(receiver.id) || await User.isInCall(this.message.author.id)) return;

                let startTime = Date.now();

                this.message.author.send(`**${receiver.username}** accepted your call. Hang up any time sending \`hang up\``),
                receiver.send(`You started a call with ${caller.anonymous ? 'an anonymous caller' : `**${this.message.author.username}**`}. Hang up any time sending \`hang up\``)
                
                let users = [this.message.author, receiver];

                for (let user of users) await User.toggleInCall(user.id, true);
                
                let collectors = users.map(user => {
                    let filter = message => message.author.id == user.id;
                    return user.dmChannel.createMessageCollector(filter);
                });

                for (let index = 0; index < users.length; index++) {
                    let user = users[index];
                    let otherUser = users[(index + 1) % 2];

                    let collector = collectors[index];

                    collector.on('collect', async message => {
                        if (message.content.toLowerCase() == 'hang up') {
                            let callTime = Date.now() - startTime;
                            users.forEach(user => user.send(`The call has ended and lasted for \`${utils.format(callTime / 1000)}\``));

                            for (let user of users) {
                                await Promise.all([User.toggleInCall(user.id, false), Phone.addToHistory(user.id, index == 0 && caller.anonymous ? 'Anonymous' : user.username, callTime / 1000)]);
                            }

                            return collectors.forEach(collector => collector.stop());
                        }

                        let prefixMessage = `***${index == 0 && caller.anonymous ? 'Anonymous' : user.username}:*** `;
                        otherUser.send(prefixMessage + message.content.slice(0, 2000 - prefixMessage.length));
                    });
                }
            } else if (timeOver) {
                let text = `:cry: Your call exceded the response time. Do you want to leave a voicemail?`;
                let confirmation = this.createConfirmation({text, userID: this.message.author.id, embedColor: this.client.options.mainColor});

                confirmation.on('confirmation', async confirmed => {
                    if (confirmed) {
                        this.message.say(`:telephone: Write down a message:`);
                        
                        let filter = message => message.author.id == this.message.author.id;
                        this.message.author.dmChannel.awaitMessages(filter, {max: 1, time: 60000}).then(collected => {
                            let content = collected.first().content;

                            let prefix = `${caller.anonymous ? 'An anonymous caller' : `**${this.message.author.username}**`} left you a message: `;
                            receiver.send(prefix + content.slice(0, 2000 - prefix.length));

                            this.message.say(`:white_check_mark: You have sent a voicemail.`);
                        }).catch(() => this.message.say(`:no_good: Your voicemail time is over.`));
                    } else {
                        let phone = await Phone.getByUserID(this.message.author.id);
                        receiver.send(`:iphone: The \`${phone.id}\` phone number tried to call you.`);
                    }
                });

                confirmation.on('over', async timeOver => {
                    if (timeOver) {
                        let phone = await Phone.getByUserID(this.message.author.id);
                        receiver.send(`:iphone: The \`${phone.id}\` phone number tried to call you.`);
                    }
                });
            } else {
                this.message.say(`:cry: The person you tried to call rejected your call.`);
            }
        }).catch(async err => {
            console.log(err);

            if (!message.deleted) await message.delete();
            this.message.say(`:no_good: An unexpected error has occurred. Try again.`);
        });

        for (let reaction of reactions) await message.react(reaction);
    }
}