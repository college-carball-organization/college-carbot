import {MigrationInterface, QueryRunner} from "typeorm";

export class initialDatabase1565225347432 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "users" ("user_id" bigint NOT NULL, "join_date" TIMESTAMP NOT NULL DEFAULT now(), "school_id" smallint, CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "schools_region_enum" AS ENUM('North', 'South', 'East', 'West', 'Undefined')`);
        await queryRunner.query(`CREATE TYPE "schools_province_enum" AS ENUM('Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Ontario', 'Quebec', 'Nova Scotia', 'New Brunswick', 'Manitoba', 'British Columbia', 'Prince Edward Island', 'Saskatchewan', 'Alberta', 'Newfoundland and Labrador', 'undefined')`);
        await queryRunner.query(`CREATE TABLE "schools" ("school_id" SMALLSERIAL NOT NULL, "school_name" text NOT NULL, "school_abbr" text NOT NULL, "region" "schools_region_enum" NOT NULL DEFAULT 'Undefined', "province" "schools_province_enum" NOT NULL DEFAULT 'undefined', "color_primary" character(6) NOT NULL, "color_secondary" character(6) NOT NULL, "color_alt_primary" character(6) NOT NULL, "color_alt_secondary" character(6) NOT NULL, "founding_date" TIMESTAMP NOT NULL DEFAULT now(), "president_id" bigint, CONSTRAINT "REL_213364ed6776077c59c0707eb7" UNIQUE ("president_id"), CONSTRAINT "PK_b583c16d9acb0fac63d8315db39" PRIMARY KEY ("school_id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_25e1cf8f41bae2f3d11f3c2a028" FOREIGN KEY ("school_id") REFERENCES "schools"("school_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schools" ADD CONSTRAINT "FK_213364ed6776077c59c0707eb71" FOREIGN KEY ("president_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "schools" DROP CONSTRAINT "FK_213364ed6776077c59c0707eb71"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_25e1cf8f41bae2f3d11f3c2a028"`);
        await queryRunner.query(`DROP TABLE "schools"`);
        await queryRunner.query(`DROP TYPE "schools_province_enum"`);
        await queryRunner.query(`DROP TYPE "schools_region_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
