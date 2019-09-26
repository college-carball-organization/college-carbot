/*******************************************************************************
 * FILE: ListSchools
 * DESCRIPTION:
 *  List all registered schools
 ******************************************************************************/

import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {Message, RichEmbed} from "discord.js";
import {getConnection} from "typeorm";
import {School as SchoolRecord} from "../../entities/School";
import rm from "discord.js-reaction-menu";

// noinspection JSUnusedGlobalSymbols
export class AddSchoolCommand extends Command {

    constructor(client: CommandoClient) {
        super(client, {
            name: 'list-schools',
            group: 'students',
            aliases: ['ls'],
            memberName: 'list-schools',
            description: 'List all registered schools',
        })
    }

    private async separateListIntoSublists<T>(list: T[], max: number): Promise<T[][]> {
        const sublists: T[][] = [];
        for (let i = 0; i < list.length; i += max) {
            let start = i;
            let end = start + max < list.length
                ? start + max
                : list.length;
            sublists.push(list.slice(start, end));
        }
        return sublists;
    }

    private async buildSchoolMenuPages(schools: SchoolRecord[]): Promise<RichEmbed[]> {
        const sortedSchools = schools.sort((l, r) => l.name.localeCompare(r.name));
        const chunkedSchools = await this.separateListIntoSublists(sortedSchools, 10);
        const totalPages = chunkedSchools.length;
        let pageNumber = 1;
        return chunkedSchools.map((schools: SchoolRecord[]) =>
            new RichEmbed()
                .setColor('#24A8E0')
                .addField('Registered Schools', schools.map(s => s.name).join('\n'))
                .setFooter(`Page ${pageNumber++}/${totalPages}`));
    }

    public async run(msg: CommandMessage): Promise<Message | Message[]> {
        const channel = msg.channel;
        const author = msg.author;
        const schoolRepository = getConnection().getRepository(SchoolRecord);
        const schoolRecords = await schoolRepository.find();
        const schoolMenuPages = await this.buildSchoolMenuPages(schoolRecords);
        new rm.menu(channel, author.id, schoolMenuPages, 60000);
        return [];
    }
}