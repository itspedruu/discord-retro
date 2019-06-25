// Packages
const {Client} = require('dolphin-discord');
const mongoose = require('mongoose');

// Import environment variables from .env
require('dotenv').config();

// Fetchs the Dolphin Config
const DolphinConfig = require('./dolphin_config.json');

// Create a Dolphin Client instance
const client = new Client(DolphinConfig);

// Attach config file to client
client.config = require('./config.json');

// Handle errors from unhandledRejections
process.on('unhandledRejection', console.error);

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

// Starts the bot
client.login(process.env.TOKEN);