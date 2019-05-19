/// <reference path='../node_modules/discord.js-commando/typings/index.d.ts' />

import Commando from "discord.js-commando";
import * as path from "path";
import sqlite from "sqlite";

if (process.env.BOT_OWNER == "undefined") {
    console.log("You must define the BOT_OWNER environment variable!");
    process.exit();
}

const client = new Commando.CommandoClient({
    commandPrefix: '|',
    owner: process.env.BOT_OWNER
});

client.registry
    // Registers your custom command groups
    .registerGroups([
        ['roles', 'Roles'],
    ])

    // Registers all built-in groups, commands, and argument types
    .registerDefaults()

    // Registers all of the commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3'))
          .then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

if (process.env.BOT_TOKEN == "undefined") {
    console.log("You must define the BOT_TOKEN environment variable!");
    process.exit();
}


client.login(process.env.BOT_TOKEN)
      .then(() => console.log("Client has succesfully logged in!"))
      .catch(() => console.log("Client FAILED to login!"));