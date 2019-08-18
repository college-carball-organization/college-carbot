/*******************************************************************************
 * FILE: User
 * DESCRIPTION:
 *  A User Entity
 ******************************************************************************/

import {Entity, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn, Column} from 'typeorm';
import {Snowflake} from "discord.js";
import {School} from "./School";


@Entity({
    name: "users"
})
export class User {

    @PrimaryColumn({ name: "user_id", type: "bigint" })
    id!: Snowflake;

    @CreateDateColumn({ name: "join_date", type: "timestamp" })
    joinDate!: Date;

    @ManyToOne(type => School, {onDelete: "SET NULL"})
    @JoinColumn({ name: "school_id" })
    school!: School;

    @Column({ name: "is_vice_president", type: "boolean", nullable: false, default: false })
    isVicePresident!: boolean;

}