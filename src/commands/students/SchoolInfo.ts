/*******************************************************************************
 * FILE: LookupSchool
 * DESCRIPTION:
 *  Get information about a given school.
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {Message, RichEmbed} from "discord.js";
import {getConnection} from "typeorm";
import {School as SchoolRecord} from "../../entities/School";

// noinspection JSUnusedGlobalSymbols
export class AddSchoolCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'lookup-school',
            group: 'students',
            aliases: [],
            memberName: 'lookup-school',
            description: 'Lookup a school in the database',
            args: [
                {
                    key: 'school',
                    prompt: 'What school do you want to lookup?',
                    type: 'string',
                    max: 64
                }
            ]
        })
    }

    public async run(
        msg: CommandMessage,
        { school }: { school: string }
    ): Promise<Message | Message[]> {
        const _start = process.hrtime();

        const channel = msg.channel;
        const guildMembers = msg.guild.members;
        const db = getConnection();
        const schoolRepository = db.getRepository(SchoolRecord);

        // Get the user record from the database
        let schoolRecord: SchoolRecord | undefined = undefined;
        await schoolRepository.findOne({
            where: {
                name: school
            },
            relations: ["president", "students"]
        })
            .then(record => schoolRecord = record)
            .catch();

        if (schoolRecord == null) {
            return channel.send(
                `Could not find ${school}!`
            );
        }

        const recordPresident = schoolRecord!.president;
        const president = (
            recordPresident != null
            && guildMembers.get(recordPresident.id) != null)
            ? guildMembers.get(recordPresident.id)!.user.tag
            : "NO PRESIDENT";

        const students = schoolRecord!.students;
        let studentTags: string[] = [];
        for (let student of students) {
            const guildMember = guildMembers.get(student.id);
            if (guildMember !== undefined) {
                studentTags.push(guildMember.user.tag);
            }
        }

        let response = new RichEmbed()
            .setColor('#FFFFFF')
            .setTitle(schoolRecord!.name)
            .addField('Region', schoolRecord!.region, true)
            .addField('Province', schoolRecord!.province, true)
            .addField('President', president)
            .addField('Members', studentTags.join('\n'))
            .setTimestamp();

        const runtime = process.hrtime(_start);
        const msRuntime = Math.ceil(
            (runtime[0] * 1000) + (runtime[1] / 1000000)
        );

        response.setFooter(`Runtime: ${msRuntime}ms`);
        return channel.send(response);
    }
}