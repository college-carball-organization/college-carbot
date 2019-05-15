"use strict";
/// <reference path='../../node_modules/discord.js-commando/typings/index.d.ts' />
/// <reference path='../../node_modules/discord.js/typings/index.d.ts' />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    run(msg, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let guild = msg.guild;
            if (!guild.available) {
                return msg.reply('This command only works in guilds!');
            }
            let selectedRole = guild.roles.find(role => {
                return role.name === args;
            });
            if (selectedRole === undefined) {
                return msg.reply(`Role '${args}' not found!`);
            }
            let guildMembers = guild.members;
            guildMembers.sweep(member => {
                return member.roles.find(role => role == selectedRole) === undefined;
            });
            let usernames = guildMembers.array().map(member => member.user.username);
            return msg.reply(usernames.join('\n'));
        });
    }
}
exports.GrabUsersCommand = GrabUsersCommand;
;
//# sourceMappingURL=grab-users.js.map