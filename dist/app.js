"use strict";
/// <reference path='../node_modules/discord.js-commando/typings/index.d.ts' />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = __importDefault(require("discord.js-commando"));
const path = __importStar(require("path"));
const sqlite_1 = __importDefault(require("sqlite"));
const client = new discord_js_commando_1.default.CommandoClient({
    commandPrefix: '|',
    owner: '108369316512030720'
});
client.registry
    // Registers your custom command groups
    .registerGroups([
    ['roles', 'Roles'],
])
    // Registers all built-in groups, commands, and argument types
    .registerDefaults()
    // Registers all of the commands in the ./commands/ directory
    .registerCommandsIn(path.join(__dirname, 'commands'));
client.setProvider(sqlite_1.default.open(path.join(__dirname, 'settings.sqlite3'))
    .then(db => new discord_js_commando_1.default.SQLiteProvider(db))).catch(console.error);
client.login('BOT SECRET TOKEN')
    .then(() => console.log("Client has succesfully logged in!"))
    .catch(() => console.log("Client FAILED to login!"));
//# sourceMappingURL=app.js.map