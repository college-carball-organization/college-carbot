"use strict";
/*******************************************************************************
 * FILE: GrabUsers
 * DESCRIPTION:
 *  This is a test command created to get familiar with Discord.js and Commando.
 ******************************************************************************/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='../../node_modules/discord.js-commando/typings/index.d.ts' />
/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />
const discord_js_commando_1 = require("discord.js-commando");
class GrabUsersCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'grab-users',
            group: 'roles',
            aliases: ['gu'],
            memberName: 'grab-users',
            description: 'Return all users who have a given role.',
            args: [
                {
                    key: 'role',
                    prompt: 'What role do you want to grab users from?',
                    type: 'string',
                    max: 32
                }
            ]
        });
    }
    run(msg, { role }) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Get the guild the command was sent from */
            let guild = msg.guild;
            if (!guild.available) {
                return msg.channel.send('This command only works in guilds!');
            }
            /* Obtain the role the argument references (if it exists) */
            let selectedRole = guild.roles.find(r => {
                return r.name === role;
            });
            if (selectedRole === null) {
                return msg.channel.send(`Role '${role}' not found!`);
            }
            /* Obtain a list of all users who have the given role */
            let usernames = guild.members.array()
                .filter((member) => {
                return member.roles.find((role) => role === selectedRole);
            })
                .map((member) => member.user.username);
            return msg.channel.send(usernames.join('\n'));
        });
    }
}
exports.GrabUsersCommand = GrabUsersCommand;
;
//# sourceMappingURL=GrabUsers.js.map