# CollegeCarbot
> CollegeCarbot is a discord bot built specifically for the needs of the
  College Carball Association (CCA) discord server. Its primary mission is to
  keep track of discord roles of users given their current status as students.

[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://discord.gg/EDwd5wr)

## Installation

```sh
git clone <this github repo>
cd college-carbot
npm install
```

The install above will install all dependencies. If you wish to only install the
production dependencies, replace the last command with the following

```sh
npm install --only=production
```

## Running the bot

CollegeCarbot requires a discord bot token to authenticate its login propcess.
This token should be added to the ENV file `.env`, which should be
formatted using `.env.example` as an example.

### Production

Running the bot in production only requires you to use one command.

```sh
npm start
```

### Development

Running the bot in development mode requires you to have installed the
devDependencies from the Installation section and run the following command.

```sh
npm run dev
```