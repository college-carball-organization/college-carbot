/*******************************************************************************
 * FILE: MigrateSchool
 * DESCRIPTION:
 *  Migrate a school from the CCA discord role system to the database system.
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {GuildMember, Message, RichEmbed, Role, Snowflake, User} from "discord.js";
import {getConnection} from "typeorm";
import {User as UserRecord} from "../../entities/User";
import {Province, Region, School as SchoolRecord} from "../../entities/School";
import {stringify} from "querystring";


function isValidRGBHex(hex: string) : boolean {
    return !!hex.match(/^[0-9a-fA-F]{6}$/);
}

function regions() : Array<string> {
    return Object.keys(Region).filter(region => region != "NULL");
}

function provinces() : Array<string> {
    return Object.keys(Province).filter(province =>  province != "NULL");
}

// noinspection JSUnusedGlobalSymbols
export class AddSchoolCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'migrate-school',
            group: 'students',
            aliases: [],
            memberName: 'migrate-school',
            description: 'Move a school role to the database',
            args: [
                {
                    key: 'school_role',
                    prompt: 'What school do you want to migrate?',
                    type: 'role'
                },
                {
                    key: 'school_name',
                    prompt: 'What is the full name of the school?',
                    type: 'string',
                    max: 96
                },
                {
                    key: 'school_abbr',
                    prompt: 'What is the abbreviated name of the school?',
                    type: 'string',
                    max: 9
                },
                {
                    key: 'region',
                    prompt: 'What is the region of the school?',
                    type: 'string',
                    max: 32
                },
                {
                    key: 'province',
                    prompt: 'What is the province of the school?',
                    type: 'string',
                    max: 32
                },
                {
                    key: 'primary_color',
                    prompt:
                        'What is the primary color of the school?' +
                        '\n(Hex without the "#")',
                    type: 'string',
                    max: 6
                },
                {
                    key: 'secondary_color',
                    prompt:
                        'What is the secondary color of the school?' +
                        '\n(Hex without the "#")',
                    type: 'string',
                    max: 6
                },
                {
                    key: 'alternate_primary_color',
                    prompt:
                        'What is the alternate primary color of the school?' +
                        '\n(Hex without the "#")',
                    type: 'string',
                    max: 6
                },
                {
                    key: 'alternate_secondary_color',
                    prompt:
                        'What is the alternate secondary color of the school?' +
                        '\n(Hex without the "#")',
                    type: 'string',
                    max: 6
                },
                {
                    key: 'president_role',
                    prompt: 'What is the role used to identify presidents?',
                    type: 'role'
                },
            ]
        })
    }

    public async run(
        msg: CommandMessage,
        {
            school_role,
            school_name,
            school_abbr,
            region,
            province,
            primary_color,
            secondary_color,
            alternate_primary_color,
            alternate_secondary_color,
            president_role
        } : {
            school_role: Role,
            school_name: string,
            school_abbr: string,
            region: string,
            province: string,
            primary_color: string,
            secondary_color: string,
            alternate_primary_color: string,
            alternate_secondary_color: string,
            president_role: Role
        }
    ): Promise<Message | Message[]> {
        const _start = process.hrtime();
        const channel = msg.channel;

        /***********************************************************************
         * Error checking
         **********************************************************************/
        let school_region = (<any> Region)[region];
        if (school_region === undefined) {
            return channel.send(
                `'${region}' is an invalid region.\n` +
                'Region must be one of the following:\n' +
                regions().join('\n')
            );
        }

        let school_province = (<any> Province)[province];
        if (school_province === undefined) {
            return channel.send(
                `'${province}' is an invalid province.\n` +
                'Province must be one of the following:\n' +
                provinces().join('\n')
            );
        }

        if (!isValidRGBHex(primary_color)) {
            return channel.send(
                `'${primary_color}' is not a valid hex color code.`
            );
        }

        if (!isValidRGBHex(secondary_color)) {
            return channel.send(
                `'${secondary_color}' is not a valid hex color code.`
            );
        }

        if (!isValidRGBHex(alternate_primary_color)) {
            return channel.send(
                `'${alternate_primary_color}' is not a valid hex color code.`
            );
        }

        if (!isValidRGBHex(alternate_secondary_color)) {
            return channel.send(
                `'${alternate_secondary_color}' is not a valid hex color code.`
            );
        }


        /***********************************************************************
         * Database connections
         **********************************************************************/
        const db = getConnection();
        const userRepository = db.getRepository(UserRecord);
        const schoolRepository = db.getRepository(SchoolRecord);


        /***********************************************************************
         * Grab relevant users
         **********************************************************************/
        const students: Array<GuildMember> = [...school_role.members.values()];
        const president: GuildMember | undefined = students.find(
            (student: GuildMember) => student.roles.find(
                (role: Role) => role === president_role
            ) != undefined
        );

        // Add students to database if they aren't already inside
        const studentRecordObjects = students.map(
            guildMember => {
                const snowflake: Snowflake = guildMember.user.id;
                return { id: snowflake}
            }
        );

        const studentRecords: Array<UserRecord> = students.map(student => {
            let record = new UserRecord();
            record.id = student.user.id;
            return record;
        });

        /***********************************************************************
         * Add information to database
         **********************************************************************/
        // Add president to database if not already inside
        let presidentRecord: UserRecord | undefined;
        if (president !== undefined) {
            await userRepository.findOne({ id: president.user.id })
                .then(record => presidentRecord = record)
                .catch();

            // User does not already exists in the database
            if (presidentRecord === undefined) {
                presidentRecord = new UserRecord();
                presidentRecord.id = president.user.id;
                await userRepository.save(presidentRecord);
            }
        }

        const newSchool = new SchoolRecord();
        newSchool.name = school_name;
        newSchool.abbr = school_abbr;
        newSchool.region = school_region;
        newSchool.province = school_province;
        newSchool.colorPrimary = primary_color;
        newSchool.colorSecondary = secondary_color;
        newSchool.colorAltPrimary = alternate_primary_color;
        newSchool.colorAltSecondary = alternate_secondary_color;
        if (presidentRecord !== undefined) {
            newSchool.president = presidentRecord;
        }
        await schoolRepository.save(newSchool);

        let promises: Promise<UserRecord>[] = [];
        studentRecords.forEach(student => {
            student.school = newSchool;
            promises.push(userRepository.save(student));
        });
        await Promise.all(promises);

        let response = new RichEmbed()
            .setColor('#FFFFFF')
            .setTitle(`Added '${newSchool.name}' to database`)
            .addField('Region', newSchool.region, true)
            .addField('Province', newSchool.province, true)
            .addField('Founding Date', newSchool.foundingDate, true)
            .addField('President',
                ( newSchool.president != undefined
                ? president!.user.tag
                : "No president"))
            .addField('Members', students.map(
                guildMember => guildMember.user.tag
            ).sort().join('\n'))
            .setTimestamp();

        const runtime = process.hrtime(_start);
        const msRuntime = Math.ceil(
            // Seconds to milliseconds AND nanoseconds to milliseconds
            (runtime[0] * 1000) + (runtime[1] / 1000000)
        );
        response.setFooter(`Runtime: ${msRuntime}ms`);

        return channel.send(response);
    }
}