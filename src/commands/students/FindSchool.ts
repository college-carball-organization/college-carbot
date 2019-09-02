/*******************************************************************************
 * FILE: FindSchool
 * DESCRIPTION:
 *  Get public information about a given school.
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {Message, RichEmbed} from "discord.js";
import {getCustomRepository} from "typeorm";
import {SchoolRepository} from "../../repositories/SchoolRepository";
import {School} from "../../entities/School";

// noinspection JSUnusedGlobalSymbols
export class AddSchoolCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'find-school',
            group: 'students',
            aliases: ['fsc'],
            memberName: 'find-school',
            description: 'Find a school in the database',
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
        const schoolRepository = getCustomRepository(SchoolRepository);

        // Get school
        const schoolSearchResults = await schoolRepository.findFuzzySchools(school);
        if (schoolSearchResults.length === 0) {
            return channel.send(`Could not find any results for '${school}'!`);
        }
        const schoolRecord: School = schoolSearchResults[0];

        // Get president
        const president = (
            schoolRecord.president != null
            && guildMembers.get(schoolRecord.president.id) != null)
            ? guildMembers.get(schoolRecord.president.id)!.user.tag
            : "NO PRESIDENT";

        // Get students
        const students: string[] = schoolRecord.students
            .map(user => {
                const guildMember = guildMembers.get(user.id);
                return guildMember !== undefined
                    ? guildMember.user.tag
                    : `${user.id} - Not in server`;
            })
            .sort((lhs, rhs) => {
                const discriminatorRegexp = /#[0-9]{4}/;
                if (discriminatorRegexp.test(lhs) && !discriminatorRegexp.test(rhs)) {
                    return -1;
                }
                else if (!discriminatorRegexp.test(lhs) && discriminatorRegexp.test(rhs)) {
                    return 1;
                }
                else if (!discriminatorRegexp.test(lhs) && discriminatorRegexp.test(rhs)) {
                    return 0;
                }
                else {
                    if( lhs < rhs )
                        return -1;
                    if( lhs > rhs )
                        return 1;
                    return 0;
                }
            });

        // Get vice president
        let vicePresidents: string[] | string = schoolRecord.students
            .filter(user => user.isVicePresident)
            .map(user => {
                const guildMember = guildMembers.get(user.id);
                return guildMember !== undefined ? guildMember.user.tag : "";
            }).filter(student => student !== "");
        vicePresidents = vicePresidents.length > 0 ? vicePresidents : "NO VICE PRESIDENT";

        // Build embed
        let response = new RichEmbed()
            .setColor(schoolRecord.colorPrimary)
            .setTitle(schoolRecord.name)
            .addField('Region', schoolRecord!.region, true)
            .addField('Province', schoolRecord!.province, true)
            //.addField('Founding Date', schoolRecord!.foundingDate, true)
            .addField('President', president, true)
            .addField('Vice Presidents', vicePresidents, true)
            .addField('Members', students)
            .setTimestamp();

        // Add runtime to footer
        const runtime = process.hrtime(_start);
        const msRuntime = Math.ceil(
            // Seconds to milliseconds AND nanoseconds to milliseconds
            (runtime[0] * 1000) + (runtime[1] / 1000000)
        );
        response.setFooter(`Runtime: ${msRuntime}ms`);

        return channel.send(response);
    }
}