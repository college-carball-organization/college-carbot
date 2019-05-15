/// <reference path='../../node_modules/discord.js-commando/typings/index.d.ts' />
/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />

import {CommandoClient, Command, CommandMessage} from "discord.js-commando";
import {Guild, Role, Message, GuildMember, Collection, Snowflake} from "discord.js";

export class GrabUsersCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'grab-users',
            group: 'roles',
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

    async run(msg: CommandMessage, args: {} | string | string[]): Promise<Message | Message[]> {
        let guild: Guild = msg.guild;
        if (!guild.available) {
            return msg.reply('This command only works in guilds!');
        }

        let selectedRole: Role = guild.roles.find(role => {
            return role.name === args;
        });
        if (selectedRole === undefined) {
            return msg.reply(`Role '${args}' not found!`);
        }

        let guildMembers: Collection<Snowflake, GuildMember> = guild.members;
        guildMembers.sweep(
            member => {
                return member.roles.find(
                    role => role == selectedRole
                ) === undefined;
            }
        );

        let usernames = guildMembers.array().map(member => member.user.username);
        return msg.reply(usernames.join('\n'));
    }
};