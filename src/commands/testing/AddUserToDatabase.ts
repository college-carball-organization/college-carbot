/*******************************************************************************
 * FILE: AddUserToDatabase
 * DESCRIPTION:
 *  Add a Discord user to the database.
 ******************************************************************************/

import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {Message} from "discord.js";
import {getConnection} from 'typeorm';
import {User} from '../../entities/User'


// noinspection JSUnusedGlobalSymbols
export class AddUserToDatabaseCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'add-user-to-database',
            group: 'testing',
            aliases: ['autd'],
            memberName: 'add-user-to-database',
            description: 'Add a discord user to the database',
            args: [
                {
                    key: 'tag',
                    prompt: 'Who do you want to add to the database?',
                    type: 'string',
                    max: 38
                }
            ]
        })
    }

    async run(msg: CommandMessage, { tag }: { tag: string }):
    Promise<Message | Message[]> {
        // Obtain relevant database connections
        const db = getConnection();
        const userRepository = db.getRepository(User);

        // Convert username to snowflake
        const targetGuildMember = msg.guild.members.find(member => {
            return member.user.tag === tag;
        });
        if (targetGuildMember === undefined) {
            return msg.channel.send(`User '${tag}' does not exist!`);
        }
        const targetSnowflake = targetGuildMember.user.id;

        // Check if the snowflake already exists in the database.
        const matchingMember = await userRepository.findOne({
            id: targetSnowflake
        });

        // User already exists in the database
        if (matchingMember != undefined) {
            return msg.channel.send(`User '${tag}' already exists in database!`);
        }

        // User is added to the database
        let user = new User();
        user.id = targetSnowflake;
        return userRepository.save(user)
            .then(() => {
                return msg.channel.send(`Added '${tag}' to the database!`);
            }).catch(error => {
                console.error("Failed to save user to database!\n", error);
                return msg.channel.send(`Failed to add '${tag}' to database!`);
            });
    }
}