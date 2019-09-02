/*******************************************************************************
 * FILE: FindStudent
 * DESCRIPTION:
 *  Lookup public information about a student.
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {Message, Snowflake, User} from "discord.js";
import {getConnection} from "typeorm";
import {User as UserRecord} from "../../entities/User";

// noinspection JSUnusedGlobalSymbols
export class AddSchoolCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'find-student',
            group: 'students',
            aliases: ['fs'],
            memberName: 'find-student',
            description: 'Find a student in the database',
            args: [
                {
                    key: 'student',
                    prompt: 'Who do you want to lookup?',
                    type: 'user',
                    max: 32
                }
            ]
        })
    }

    public async run(
        msg: CommandMessage,
        { student } : { student: User }
    ): Promise<Message | Message[]> {
        const channel = msg.channel;
        const db = getConnection();
        const userRepository = db.getRepository(UserRecord);

        // Get the user record from the database
        const userId: Snowflake = student.id;
        let userRecord: UserRecord | undefined = undefined;
        await userRepository.findOne({
            where: {
                id: userId
            },
            relations: ["school"]
        })
            .then(record => userRecord = record)
            .catch();


        if (userRecord === undefined) {
            return channel.send(
                `Sorry, I couldn't find ${student.tag} in the database.\n` +
                `They probably aren't registered under any school`
            );
        }

        if (userRecord!.school == null) {
            return channel.send(
                `${student.tag} does not belong to a school.`
            );
        }

        return channel.send(
            `${student.tag} goes to ${userRecord!.school.name}`
        );
    }
}