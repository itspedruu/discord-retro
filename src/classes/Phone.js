const {Phones} = require('../../utils/database.js');
const utils = require('../../utils/utils.js');
const User = require('./User.js');

module.exports = class Phone {
    static async create(userID) {
        if (await Phone.hasPhone(userID)) return {result: 'error', message: 'You already have a phone number registered.'};

        let phoneNumber = await Phone.generatePhoneNumber();
        let phone = new Phones({
            _id: phoneNumber,
            userID
        });

        await phone.save();
        await User.setupPhone(userID, phoneNumber);

        return {result: 'success', message: `You created a phone number! Your phone number is \`${phoneNumber}\``};
    }

    static async generatePhoneNumber() {
        let randomPhoneNumber = new Array(3).fill().map(() => utils.randomBetween(111, 999)).join('-');
        return await Phone.exists(randomPhoneNumber) ? await Phone.generatePhoneNumber() : randomPhoneNumber;
    }

    static async exists(phoneNumber) {
        let phone = await Phone.getByPhoneNumber(phoneNumber);
        return !!phone;
    }

    static async hasPhone(userID) {
        let doc = await Phone.getByUserID(userID);
        return !!doc;
    }

    static async validatePhoneNumber(phoneNumber) {
        let isValidPhoneString = new RegExp(/\d{3}-\d{3}-\d{3}/g).test(phoneNumber);
        return isValidPhoneString && await Phone.exists(phoneNumber);
    }

    static getByPhoneNumber(phoneNumber) {
        return new Promise((resolve, reject) => {
            Phones.findById(phoneNumber, (err, doc) => {
                if (err) reject(err);
                resolve(doc);
            });
        });
    }

    static getByUserID(userID) {
        return new Promise((resolve, reject) => {
            Phones.findOne({userID}, (err, doc) => {
                if (err) reject(err);
                resolve(doc);
            });
        });
    }
}