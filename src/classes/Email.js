const {Emails} = require('../../utils/database.js');
const User = require('./User.js');

module.exports = class Email {
    static async create(userID, emailName) {
        if (await Email.hasEmail(userID)) return {result: 'error', message: 'You already have an e-mail registered.'};

        if (emailName.length > 20 || await Email.validateEmail(emailName)) return {result: 'error', message: `The email name \`${emailName}\` already exists or it's not valid. You can only use characters from **a to Z**, numbers and dashes.`};

        let email = new Emails({
            _id: emailName,
            userID
        });

        await email.save();
        await User.setupEmail(userID, emailName);

        return {result: 'success', message: `You have created an e-mail! Your e-mail is \`${emailName}@discordretro.com\``};
    }

    static async send(from, emailName, content) {
        let email = await Email.getByEmailName(emailName);

        let sentTimestamp = Date.now();
        
        email.inbox.push({from: from.id, content, sentTimestamp});
        from.sent.push({to: emailName, content, sentTimestamp});
        
        await from.save();
        await email.save();
    }

    static async validateEmail(emailName) {
        let isValidEmailName = new RegExp(/^(\w|_)+$/g).test(emailName);
        return isValidEmailName && await Email.exists(emailName);
    }

    static async hasEmail(userID) {
        let email = await Email.getByUserID(userID);
        return !!email;
    }

    static async exists(emailName) {
        let email = await Email.getByEmailName(emailName);
        return !!email;
    }

    static getByUserID(userID) {
        return new Promise((resolve, reject) => {
            Emails.findOne({userID}, (err, doc) => {
                if (err) return reject(err);

                resolve(doc);
            });
        });
    }

    static getByEmailName(emailName) {
        return new Promise((resolve, reject) => {
            Emails.findById(emailName, (err, doc) => {
                if (err) return reject(err);

                resolve(doc);
            });
        });
    }
}