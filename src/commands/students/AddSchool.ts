/*******************************************************************************
 * FILE: AddSchool
 * DESCRIPTION:
 *  Add a school to the database
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {DMChannel,
    GroupDMChannel,
    GuildMember,
    Message,
    Snowflake,
    TextChannel,
    User as DiscordUser
} from "discord.js";
import {getConnection} from 'typeorm';
import {User as UserRecord} from '../../entities/User';
import {School as SchoolRecord} from '../../entities/School';
import {Province, Region} from "../../entities/School"


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
        .catch(() => Promise.reject("Response not found."));
}

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
            name: 'add-school',
            group: 'students',
            aliases: ['as'],
            memberName: 'add-school',
            description: 'Add a school to the database',
        })
    }

    public async run(msg: CommandMessage): Promise<Message | Message[]>
    {
        // Command constants
        const channel = msg.channel;
        const cmdAuthor = msg.author;
        const responseTimeout = 30000;

        // School information
        let schoolName: string = "";
        let schoolAbbr: string = "";
        let schoolRegion: Region = Region.NULL;
        let schoolProvince: Province = Province.NULL;
        let schoolPrimaryColor: string = "";
        let schoolSecondaryColor: string = "";
        let schoolAlternatePrimaryColor: string = "";
        let schoolAlternateSecondaryColor: string = "";
        let presidentRecord: UserRecord | undefined = undefined;
        let noResponseError = "No response found. Ending school creation";


        await channel.send(
            'Starting process to add a new school.\n' +
            'You have ' + (responseTimeout / 1000) + ' seconds to respond to each question.');

        /* Get school name */
        await channel.send("What is the **full** name of the school?\n\n");
        await getResponse(channel, cmdAuthor, responseTimeout)
            .then(response => schoolName = response)
            .catch();
        if (schoolName.length == 0) { return channel.send(noResponseError); }

        /* Get school abbreviation */
        await channel.send(`What is the **abbreviated** name of the school? (5 Character max)`);
        await getResponse(channel, cmdAuthor, responseTimeout)
            .then(response => schoolAbbr = response);
        if (schoolAbbr == null) { return channel.send(noResponseError); }

        /* Get school region */
        while (true) {
            // Prompt
            await channel.send(
                "What is the **region** of the school?\n\n" +
                "__Valid choices:__\n" +
                regions().join('\n'));
            // Response
            await getResponse(channel, cmdAuthor, responseTimeout)
                .then(response => schoolRegion = (<any> Region)[response])
                .catch();
            // Action
            if (schoolRegion === null) { return channel.send(noResponseError); }
            if (schoolRegion === undefined) {
                channel.send("That is not a valid region.");
                continue;
            }
            break;
        }

        /* Get school province */
        while (true) {
            // Prompt
            await channel.send(
                "What is the **province** of the school?\n\n" +
                "__Valid choices:__\n" +
                provinces().join('\n'));
            // Response
            await getResponse(channel, cmdAuthor, responseTimeout)
                .then(response => schoolProvince = (<any> Province)[response])
                .catch();
            // Action
            if (schoolProvince === null) { return channel.send(noResponseError); }
            if (schoolProvince === undefined) {
                channel.send("That is not a valid province.");
                continue;
            }
            break;
        }

        /* Get school primary color */
        while (true) {
            // Prompt
            await channel.send(
                "What is the **primary color** of the school?\n\n" +
                "(Please use *hex* format such as '0A4DE3')\n");
            // Response
            await getResponse(channel, cmdAuthor, responseTimeout)
                .then(response => schoolPrimaryColor = response.toUpperCase())
                .catch();
            // Action
            if (schoolPrimaryColor == null) {
                return channel.send(noResponseError);
            }
            if (!isValidRGBHex(schoolPrimaryColor)) {
                channel.send("That is not a valid RGB hex color.");
                continue;
            }
            break;
        }

        /* Get school secondary color */
        while (true) {
            // Prompt
            await channel.send(
                "What is the **secondary color** of the school?\n\n" +
                "(Please use *hex* format such as '0A4DE3')\n");
            // Response
            await getResponse(channel, cmdAuthor, responseTimeout)
                .then(response => schoolSecondaryColor = response.toUpperCase())
                .catch();
            // Action
            if (schoolSecondaryColor == null) {
                return channel.send(noResponseError);
            }
            if (!isValidRGBHex(schoolSecondaryColor)) {
                channel.send("That is not a valid RGB hex color.");
                continue;
            }
            break;
        }

        /* Get school alternate primary color */
        while (true) {
            // Prompt
            await channel.send(
                "What is the **alternate primary color** of the school?\n\n" +
                "(Please use *hex* format such as '0A4DE3')\n");
            // Response
            await getResponse(channel, cmdAuthor, responseTimeout)
                .then(response => schoolAlternatePrimaryColor = response.toUpperCase())
                .catch();
            // Action
            if (schoolAlternatePrimaryColor  == null) {
                return channel.send(noResponseError);
            }
            if (!isValidRGBHex(schoolAlternatePrimaryColor )) {
                channel.send("That is not a valid RGB hex color.");
                continue;
            }
            break;
        }

        /* Get school alternate secondary color */
        while (true) {
            // Prompt
            await channel.send(
                "What is the **alternate primary color** of the school?\n\n" +
                "(Please use *hex* format such as '0A4DE3')\n");
            // Response
            await getResponse(channel, cmdAuthor, responseTimeout)
                .then(response => schoolAlternateSecondaryColor = response.toUpperCase())
                .catch();
            // Action
            if (schoolAlternateSecondaryColor  == null) {
                return channel.send(noResponseError);
            }
            if (!isValidRGBHex(schoolAlternateSecondaryColor )) {
                channel.send("That is not a valid RGB hex color.");
                continue;
            }
            break;
        }

        // Get school president
        let presidentTag: string = "";
        let presidentSnowflake: Snowflake;
        while (true) {
            // Prompt
            await channel.send(`Who is the *president* of the school?`);

            // Response
            await getResponse(channel, cmdAuthor, responseTimeout)
                .then(response => presidentTag = response)
                .catch();

            // Action
            if (presidentTag  == "") {
                return channel.send(noResponseError);
            }
            const targetGuildMember = msg.guild.members.find(member =>
                member.user.tag === presidentTag);
            if (targetGuildMember == null) {
                await channel.send(`User '${presidentTag}' does not exist!`);
                continue;
            }

            presidentSnowflake = targetGuildMember.user.id;
            break;
        }

        const db = getConnection();
        const userRepository = db.getRepository(UserRecord);
        const schoolRepository = db.getRepository(SchoolRecord);

        // Check if the snowflake already exists in the database.
        await userRepository.findOne({ id: presidentSnowflake })
            .then(record => presidentRecord = record)
            .catch();

        // User does not already exists in the database
        if (presidentRecord === undefined) {
            presidentRecord = new UserRecord();
            presidentRecord.id = presidentSnowflake;
            await userRepository.save(presidentRecord);
            await channel.send(
                `'${presidentTag}' did not exist in the database,` +
                `so I added them for you/.`);
        }

        const newSchool = new SchoolRecord();
        newSchool.name = schoolName;
        newSchool.abbr = schoolAbbr;
        newSchool.region = schoolRegion;
        newSchool.province = schoolProvince;
        newSchool.colorPrimary = schoolPrimaryColor;
        newSchool.colorSecondary = schoolSecondaryColor;
        newSchool.colorAltPrimary = schoolAlternatePrimaryColor;
        newSchool.colorAltSecondary = schoolAlternateSecondaryColor;
        newSchool.president = presidentRecord;
        await schoolRepository.save(newSchool);

        return channel.send(
            `School name: ${schoolName}\n` +
            `School abrr: ${schoolAbbr}\n` +
            `School region: ${schoolRegion}\n` +
            `School province: ${schoolProvince}\n` +
            `School PC: ${schoolPrimaryColor}\n` +
            `School SC: ${schoolSecondaryColor}\n` +
            `School APC ${schoolAlternatePrimaryColor}\n` +
            `School ASC: ${schoolAlternateSecondaryColor}\n` +
            `School president ${presidentRecord.id}\n`
        );
    }
}