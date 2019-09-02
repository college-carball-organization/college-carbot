/*******************************************************************************
 * FILE: SetVicePresident
 * DESCRIPTION:
 *  Change a school's president
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {Message, User} from "discord.js";
import {getConnection} from "typeorm";
import {User as UserRecord} from "../../entities/User";


// noinspection JSUnusedGlobalSymbols
export class SetPresidentCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'set-vp',
            group: 'students',
            aliases: [],
            memberName: 'set-vp',
            description: `Set a school's vice president`,
            argsCount: 2,
            args: [
                {
                    key: 'student',
                    prompt: 'Who do you want to be vice president?',
                    type: 'user',
                    max: 32
                }
            ]
        })
    }

    public hasPermission(msg: CommandMessage): boolean | string {
        return (
            this.client.isOwner(msg.author) ||
            msg.member.roles.find(
            role => role.name === "Eboard" || role.name === "Moderators"
        ) != undefined);
    }

    public async run(
        msg: CommandMessage,
        { student }: { student: User }
    ): Promise<Message | Message[]> {
        const channel = msg.channel;

        // Update database
        const db = getConnection();
        const userRepository = db.getRepository(UserRecord);

        let userRecord = await userRepository.findOne({
            where: {
                id: student.id
            },
            relations: ['school']
        });

        if (userRecord == null) {
            userRecord = new UserRecord();
            userRecord.id = student.id;
            await userRepository.save(userRecord);
        }

        if (userRecord.school == null) {
            return channel.send(`${student.username} is not affiliated with a school.`);
        }

        userRecord.isVicePresident = true;
        await userRepository.save(userRecord);
        return channel.send(`Set ${student.username} as a vice president for ${userRecord.school.name}.`);
    }
}