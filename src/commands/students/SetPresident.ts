/*******************************************************************************
 * FILE: SetPresident
 * DESCRIPTION:
 *  Change a school's president
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {User as DiscordUser, DMChannel, GroupDMChannel, Message, TextChannel, User} from "discord.js";
import {getConnection, getCustomRepository} from "typeorm";
import {SchoolRepository} from "../../repositories/SchoolRepository";
import {School as SchoolRecord, School} from "../../entities/School";
import {User as UserRecord} from "../../entities/User";


async function getResponse(
    channel: TextChannel | DMChannel | GroupDMChannel,
    user: DiscordUser,
    timeout: number
): Promise<string> {
    return channel.awaitMessages(
        message => message.author === user,
        {
            max: 1,
            time: timeout,
            errors: ['time']
        })
        .then(collection => Promise.resolve(collection.first().content))
        .catch(() => Promise.resolve(""));
}


// noinspection JSUnusedGlobalSymbols
export class SetPresidentCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'set-president',
            group: 'students',
            aliases: [],
            memberName: 'set-president',
            description: `Set a school's president`,
            argsCount: 2,
            args: [
                {
                    key: 'school',
                    prompt: 'What school do you want to change the president for?',
                    type: 'string',
                    max: 64
                },
                {
                    key: 'student',
                    prompt: 'Who do you want to be president?',
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
        {
            school,
            student
        }: {
            school: string,
            student: User
        }
    ): Promise<Message | Message[]> {
        const schoolRepo = getCustomRepository(SchoolRepository);
        const channel = msg.channel;

        let matches: School[] = await schoolRepo.findFuzzySchools(school);

        if (matches == null) {
            return channel.send(`Could not find school '${school}'`);
        }

        if (matches.length == 0) {
            return channel.send("Could not find school");
        }


        // Only check first response for now:
        let schoolRecord = matches[0];
        await channel.send(`Is '${schoolRecord.name}' the school you want to set the President for?`);
        const response: string = await getResponse(channel, msg.author, 20000);

        const shouldSetVP: boolean = response.match(/yes|Yes|YES|y|Y|ye|YE/) !== null;
        if (!shouldSetVP) {
            return channel.send(
                `Sorry, I either did not get a response, you responded negatively, or I did not ` +
                `understand the response. I Did **NOT** set ${student.username} as VP of ` +
                `${matches[0].name}`
            );
        }

        // Update database
        const db = getConnection();
        const userRepository = db.getRepository(UserRecord);
        const schoolRepository = db.getRepository(SchoolRecord);

        // Check if the snowflake already exists in the database.
        let presRecord: UserRecord | undefined = await userRepository.findOne({ id: student.id });
        if (presRecord == null) {
            let record = new UserRecord();
            record.id = student.id;
            await userRepository.save(record);
            presRecord = record;
        }

        presRecord.school = schoolRecord;
        await userRepository.save(presRecord);

        schoolRecord.president = presRecord;
        await schoolRepository.save(schoolRecord);

        return channel.send(`Set '${schoolRecord.name}' president to ${student.username}`);
    }
}