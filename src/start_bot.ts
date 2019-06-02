/// <reference path='../node_modules/discord.js-commando/typings/index.d.ts' />

import Commando from "discord.js-commando";
import * as path from "path";
import sqlite from "sqlite";
import {createConnection} from "typeorm";


export async function startBot() {

    /***************************************************************************
     *  Check environment variables
     **************************************************************************/
    if (process.env.BOT_OWNER == "undefined") {
        console.error("You must define the BOT_OWNER environment variable!");
        process.exit();
    }

    if (process.env.BOT_TOKEN == "undefined") {
        console.error("You must define the BOT_TOKEN environment variable!");
        process.exit();
    }


    /***************************************************************************
     *  Client configuration procedures
     **************************************************************************/
    const client = new Commando.CommandoClient({
        commandPrefix: '+',
        owner: process.env.BOT_OWNER
    });

    // Register commands
    client.registry
        // Registers your custom command groups
        .registerGroups([
            ['testing', 'Commands for Testing'],
        ])

        // Registers all built-in groups, commands, and argument types
        .registerDefaults()

        // Registers all of the commands
        .registerCommandsIn(path.join(__dirname, 'commands'))
        .registerCommandsIn(path.join(__dirname, 'commands/testing'));

    // Setup data storage provider
    client.setProvider(
        sqlite.open(path.join(__dirname, 'settings.sqlite3'))
            .then(db => new Commando.SQLiteProvider(db))
    ).catch(console.error);

    // Connect to the CCA database
    process.stdout.write("Connecting to database... ");
    await createConnection()
        .then(() => {
            console.log("SUCCESSFUL");
        })
        .catch(error => {
            console.log("FAILED");
            console.error(error);
            process.exit(0);
        });


    /***************************************************************************
     * Client login procedures
     **************************************************************************/
    process.stdout.write("Logging into Discord... ")
    await client.login(process.env.BOT_TOKEN)
        .then(() => console.log("SUCCESSFUL"))
        .catch(error => {
            console.log("FAILED");
            console.error(error);
        });
}