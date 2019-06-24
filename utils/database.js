const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    _id: String,
    email: String,
    phone: String
});

const Email = new Schema({
    _id: String,
    inbox: {type: Array, default: []}
});

const Phone = new Schema({
    _id: String,
    contacts: {type: Array, default: []}
});

module.exports = {
    Users: mongoose.model('user', User),
    Emails: mongoose.model('email', Email),
    Phones: mongoose.model('phone', Phone)
}