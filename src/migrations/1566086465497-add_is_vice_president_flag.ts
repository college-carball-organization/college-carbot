import {MigrationInterface, QueryRunner} from "typeorm";

export class addIsVicePresidentFlag1566086465497 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_vice_president" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_vice_president"`);
    }

}
