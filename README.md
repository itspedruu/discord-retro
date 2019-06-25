<div align="center">
    <img src="https://cdn.discordapp.com/attachments/226684919718346762/593177273335808012/discord_retro_minified.png">
</div>

## What is it?

Discord Retro is a project for the Discord Hack Week. It consists in turning discord "retro". And why is that? That is because this bot makes possible to create *fictional* emails and phones. You can call users, send e-mails, save contacts, and much more **all inside Discord**.

## Architecture

Discord Retro uses [MongoDB](https://www.mongodb.com/) as it's database to store the users information such as e-mails, contacts and etc. We use **MongoDB** because of my experience and accessibility in such a short timespan. It also uses [DiscordJS](https://discord.js.org/), an open-source discord library to handle the Discord API, and [Dolphin](https://github.com/itspedruu/dolphin), a discord.js framework to easily create bots created by [me](https://github.com/itspedruu).

## Setup

1. Install [Node](https://nodejs.org/)
2. Replace `.env.example` file name to `.env`
3. Attribute a [discord bot token](https://discordapp.com/developers/applications/) in `.env` to the `TOKEN` parameter
4. Attribue a MongoDB connection url in `.env` to the `MONGO_URL` parameter. You can create a 512MB MongoDB database for free [here](https://www.mongodb.com/cloud/atlas).
5. Open your command prompt, go to the bot folder using `cd "FOLDER_PATH"` and then execute `npm start`. Enjoy!

## License

> Copyright 2019 Pedro Pinto
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.