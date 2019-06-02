/*******************************************************************************
 * FILE: GrabUsers
 * DESCRIPTION:
 *  This is a test command created to get familiar with Discord.js and Commando.
 ******************************************************************************/

/// <reference path='../../node_modules/discord.js-commando/typings/index.d.ts' />
/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />

import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {Guild, Role, Message, GuildMember} from "discord.js";

export class GrabUsersCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'grab-users',
            group: 'testing',
            aliases: ['gu'],
            memberName: 'grab-users',
            description: 'Return all users who have a given role.',
            args: [
                {
                    key: 'role',
                    prompt: 'What role do you want to grab users from?',
                    type: 'string',
                    max: 32
                }
            ]
        });
    }

    async run(msg: CommandMessage, { role }: { role: string }): Promise<Message | Message[]> {

        /* Get the guild the command was sent from */
        let guild: Guild = msg.guild;
        if (!guild.available) {
            return msg.channel.send('This command only works in guilds!');
        }

        /* Obtain the role the argument references (if it exists) */
        let selectedRole: Role = guild.roles.find(r => {
            return r.name === role;
        });
        if (selectedRole === null) {
            return msg.channel.send(`Role '${role}' not found!`);
        }

        /* Obtain a list of all users who have the given role */
        let usernames: Array<string> = guild.members.array()
            .filter((member: GuildMember) => {
                return member.roles.find(
                    (role: Role) => role === selectedRole
                );
            })
            .map((member: GuildMember) => member.user.username);


        return msg.channel.send(usernames.join('\n'));
    }
};