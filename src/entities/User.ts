/*******************************************************************************
 * FILE: User
 * DESCRIPTION:
 *  A User Entity
 ******************************************************************************/

import {Entity, PrimaryColumn, CreateDateColumn} from 'typeorm';
import {Snowflake} from "discord.js";


@Entity()
export class User {

    @PrimaryColumn({ name: "user_id", type: "bigint" })
    id!: Snowflake;

    @CreateDateColumn({ name: "join_date", type: "timestamptz" })
    joinDate!: Date;

}