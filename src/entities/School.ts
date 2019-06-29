/*******************************************************************************
 * FILE: User
 * DESCRIPTION:
 *  A User Entity
 ******************************************************************************/

import {
    Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {User} from './User'


export enum Region {
    NORTH = "North",
    SOUTH = "South",
    EAST = "East",
    WEST = "West",
    NULL = "Undefined"
}

export enum Province {
    ALABAMA = "Alabama",
    ALASKA = "Alaska",
    ARIZONA = "Arizona",
    ARKANSAS = "Arkansas",
    CALIFORNIA = "California",
    COLORADO = "Colorado",
    CONNECTICUT = "Connecticut",
    DELAWARE = "Delaware",
    FLORIDA = "Florida",
    GEORGIA = "Georgia",
    HAWAII = "Hawaii",
    IDAHO = "Idaho",
    ILLINOIS = "Illinois",
    INDIANA = "Indiana",
    IOWA = "Iowa",
    KANSAS = "Kansas",
    KENTUCKY = "Kentucky",
    LOUISIANA = "Louisiana",
    MAINE = "Maine",
    MARYLAND = "Maryland",
    MASSACHUSETTS = "Massachusetts",
    MICHIGAN = "Michigan",
    MINNESOTA = "Minnesota",
    MISSISSIPPI = "Mississippi",
    MISSOURI = "Missouri",
    MONTANA = "Montana",
    NEBRASKA = "Nebraska",
    NEVADA = "Nevada",
    NEW_HAMPSHIRE = "New Hampshire",
    NEW_JERSEY = "New Jersey",
    NEW_MEXICO = "New Mexico",
    NEW_YORK = "New York",
    NORTH_CAROLINA = "North Carolina",
    NORTH_DAKOTA = "North Dakota",
    OHIO = "Ohio",
    OKLAHOMA = "Oklahoma",
    OREGON = "Oregon",
    PENNSYLVANIA = "Pennsylvania",
    RHODE_ISLAND = "Rhode Island",
    SOUTH_CAROLINA = "South Carolina",
    SOUTH_DAKOTA = "South Dakota",
    TENNESSEE = "Tennessee",
    TEXAS = "Texas",
    UTAH = "Utah",
    VERMONT = "Vermont",
    VIRGINIA = "Virginia",
    WASHINGTON = "Washington",
    WEST_VIRGINIA = "West Virginia",
    WISCONSIN = "Wisconsin",
    WYOMING = "Wyoming",
    ONTARIO = "Ontario",
    QUEBEC = "Quebec",
    NOVA_SCOTIA = "Nova Scotia",
    NEW_BRUNSWICK = "New Brunswick",
    MANITOBA = "Manitoba",
    BRITISH_COLUMBIA = "British Columbia",
    PRINCE_EDWARD_ISLAND = "Prince Edward Island",
    SASKATCHEWAN = "Saskatchewan",
    ALBERTA = "Alberta",
    NEWFOUNDLAND_AND_LABRADOR = "Newfoundland and Labrador",
    NULL = "undefined"
}

@Entity({
    name: "schools",
    schema: "cca",
    orderBy: {
        name: "ASC"
    }
})
export class School {

    @PrimaryGeneratedColumn({ name: "school_id", type: "smallint" })
    id!: number;

    @Column({ name: "school_name", type: "text" })
    name!: string;

    @Column({ name: "school_abbr", type: "text" })
    abbr!: string;

    @Column({ name: "region", type: "enum", enum: Region, default: Region.NULL })
    region!: Region;

    @Column({ name: "province", type: "enum", enum: Province, default: Province.NULL })
    province!: Province;

    @Column({ name: "color_primary", type: "char", length: 6 })
    colorPrimary!: string;

    @Column({ name: "color_secondary", type: "char", length: 6 })
    colorSecondary!: string;

    @Column({ name: "color_alt_primary", type: "char", length: 6 })
    colorAltPrimary!: string;

    @Column({ name: "color_alt_secondary", type: "char", length: 6 })
    colorAltSecondary!: string;

    @OneToOne(type => User)
    @JoinColumn()
    president!: User;

    @OneToMany(type => User, user => user.school, {
        cascade: true
    })
    students!: User[];

    @CreateDateColumn({ name: "founding_date", type: "timestamp" })
    foundingDate!: Date;

}