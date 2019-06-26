const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    _id: String,
    email: String,
    phone: String,
    inCall: {type: Boolean, default: false}
});

const Email = new Schema({
    _id: String,
    inbox: {type: Array, default: []},
    userID: String,
    sent: {type: Array, default: []},
    blocked: {type: Array, default: []}
});

const Phone = new Schema({
    _id: String,
    contacts: {type: Array, default: []},
    userID: String,
    blocked: {type: Array, default: []},
    anonymous: {type: Boolean, default: false},
    public: {type: Boolean, default: false},
    history: {type: Array, default: []}
});

module.exports = {
    Users: mongoose.model('user', User),
    Emails: mongoose.model('email', Email),
    Phones: mongoose.model('phone', Phone)
}