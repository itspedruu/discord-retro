const {Users} = require('../../utils/database.js');
const {Collection} = require('discord.js');

exports.run = async client => {
    client.collectors = new Collection();

    await Users.updateMany({inCall: true}, { $set: {inCall: false} });
}