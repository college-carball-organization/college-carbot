/*******************************************************************************
 * FILE: User
 * DESCRIPTION:
 *  A User Entity
 ******************************************************************************/

import {Entity, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import {Snowflake} from "discord.js";
import {School} from "./School";


@Entity({
    name: "users",
    schema: "cca"
})
export class User {

    @PrimaryColumn({ name: "user_id", type: "bigint" })
    id!: Snowflake;

    @CreateDateColumn({ name: "join_date", type: "timestamptz" })
    joinDate!: Date;

    @ManyToOne(type => School)
    @JoinColumn({ name: "school_id" })
    school!: School;

}