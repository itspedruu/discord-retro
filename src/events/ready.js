const {Users} = require('../../utils/database.js');

exports.run = () => Users.updateMany({inCall: true}, { $set: {inCall: false} });