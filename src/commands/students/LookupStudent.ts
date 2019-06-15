/*******************************************************************************
 * FILE:
 * DESCRIPTION:
 *
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {Message} from "discord.js";
import {School as SchoolRecord} from '../../entities/School';
import {getConnection} from "typeorm";
import {User as UserRecord} from "../../entities/User";

// noinspection JSUnusedGlobalSymbols
export class AddSchoolCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'lookup-student',
            group: 'students',
            aliases: ['lookup', 'ls'],
            memberName: 'lookup-school',
            description: 'Lookup a student in the database',
            args: [
                {
                    key: 'student',
                    prompt: 'Who do you want to lookup?',
                    type: 'string',
                    max: 32
                }
            ]
        })
    }

    public async run(
        msg: CommandMessage,
        student: string
    ): Promise<Message | Message[]> {
        const channel = msg.channel;

        const db = getConnection();
        const userRepository = db.getRepository(UserRecord);
        const schoolRepository = db.getRepository(SchoolRecord);

        // Get discord user
        const discordUser = msg.guild.members.find(member =>
            member.user.tag === student);
        if (discordUser == null) {
            return channel.send(
                `Sorry, I couldn't find ${student} in the server`
            );
        }

        return channel.send("");
    }
}