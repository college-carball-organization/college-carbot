/*******************************************************************************
 * FILE: AddStudent
 * DESCRIPTION:
 *  Add a student to the database
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {Message, Snowflake, User} from "discord.js";
import {getConnection} from "typeorm";
import {School as SchoolRecord} from '../../entities/School';
import {User as UserRecord} from "../../entities/User";

// noinspection JSUnusedGlobalSymbols
export class AddSchoolCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'add-student',
            group: 'students',
            aliases: [],
            memberName: 'add-student',
            description: 'Add a student in the database',
            argsCount: 2,
            args: [
                {
                    key: 'school',
                    prompt: 'What school do you want to add to?',
                    type: 'string',
                    max: 64
                },
                {
                    key: 'student',
                    prompt: 'Who do you want to add?',
                    type: 'user',
                    max: 32
                }
            ]
        })
    }

    public hasPermission(msg: CommandMessage): boolean | string {
        return msg.member.roles.find(
            role => role.name === "Eboard" || role.name === "Moderators"
        ) != undefined;
    }

    public async run(
        msg: CommandMessage,
        {
            school,
            student
        }: {
            school: string,
            student: User
        }
    ): Promise<Message | Message[]> {
        const channel = msg.channel;
        const db = getConnection();

        // Get school
        const schoolRepository = db.getRepository(SchoolRecord);
        let schoolRecord: SchoolRecord | undefined = undefined;
        await schoolRepository.findOne({
            where: {
                name: school
            }})
            .then(school => schoolRecord = school)
            .catch();
        if (schoolRecord == null) {
            return channel.send(
                `Sorry, I couldn't find ${school} in the database.`
            );
        }

        // Get user from database if record exists
        const userRepository = db.getRepository(UserRecord);
        let userRecord: UserRecord | undefined = undefined;
        const userId: Snowflake = student.id;
        await userRepository.findOne({
            where: {
                id: userId
            },
            relations: ['school']
        })
            .then(user => userRecord = user)
            .catch();

        // Make a new user if they didn't exist
        if (userRecord == null) {
            userRecord = new UserRecord();
            userRecord.id = userId;
            await channel.send(
                `'${student.tag}' didn't exist in the database, so I added them for you.`
            );
        // Do not add user to school if they already attend
        } else if (userRecord!.school == schoolRecord) {
            return channel.send(
                `'${student.tag}' is already a member of '${school}'!`
            );
        }

        // Add student to given school
        userRecord.school = schoolRecord;
        userRepository.save(userRecord);
        return channel.send(
            `Added '${student.tag}' to '${school}'`
        );
    }
}