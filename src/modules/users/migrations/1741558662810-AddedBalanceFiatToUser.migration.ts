import { Logger } from "@nestjs/common";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBalanceFiatToUser1741558662810 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        Logger.log(`🤖🤖🤖🤖🤖🤖🤖🤖 Running migration AddedBalanceFiatToUser1741558662810`)

        // Create enum
        await queryRunner.query(
            `CREATE TYPE public."Fiat" AS ENUM ('eur', 'usd')`
        )

        await queryRunner.query(
            `ALTER TABLE "user" ADD COLUMN "balanceCurrency" public."Fiat"`,
        )

        await queryRunner.query(
            `UPDATE "user" SET "balanceCurrency" = 'usd'::public."Fiat" WHERE true`,
        )
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        Logger.log(`🤖🤖🤖🤖🤖🤖🤖🤖 Rollback migration AddedBalanceFiatToUser1741558662810`)
        await queryRunner.query(
            `ALTER TABLE "user" DROP COLUMN "balanceCurrency"`,
        )

        await queryRunner.query(
            `ALTER TABLE "user" DROP TYPE public."Fiat"`,
        )
    }
}
