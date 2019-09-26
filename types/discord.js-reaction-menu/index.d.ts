// <reference path="../../node_modules/discord.js/typings/index.d.ts" />

declare module "discord.js-reaction-menu" {

    import {DMChannel, GroupDMChannel, RichEmbed, Snowflake, TextChannel} from "discord.js";

    export class menu {
        constructor(
            channel: TextChannel | DMChannel | GroupDMChannel,
            uid: Snowflake,
            pages: RichEmbed[],
            time: number);
        private select(pg: number): void;
        private createCollector(uid: Snowflake);
        private addReactions();
    }
}