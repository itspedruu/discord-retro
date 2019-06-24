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

    static async addContact(id, name, phoneNumber) {
        if (name.length > 20) return {result: 'error', message: 'The contact name can not have more than 20 characters.'};

        if (!await Phone.validatePhoneNumber(phoneNumber)) return {result: 'error', message: `The phone number \`${phoneNumber}\` doesn't exist in the phone book.`};

        let phone = await Phone.getByUserID(id);
        if (phone.contacts.some(contact => contact.phone == phoneNumber)) return {result: 'error', message: 'The contact you are trying to save already exists. Delete it using `.removecontact`'};

        phone.contacts.push({name, phone: phoneNumber});
        await phone.save();

        return {result: 'success', message: `Saved \`${phoneNumber}\` phone number as **${name}**`};
    }

    static async removeContact(id, phoneNumber) {
        if (!await Phone.validatePhoneNumber(phoneNumber)) return {result: 'error', message: `The phone number \`${phoneNumber}\` doesn't exist in the phone book.`};

        let phone = await Phone.getByUserID(id);
        if (!phone.contacts.some(contact => contact.phone == phoneNumber)) return {result: 'error', message: 'The contact you are trying to remove is not saved in your contacts.'};

        let index = phone.contacts.findIndex(contact => contact.phone == phoneNumber);
        phone.contacts.splice(index, 1);
        await phone.save();

        return {result: 'success', message: `Removed \`${phoneNumber}\` from your contacts.`};
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