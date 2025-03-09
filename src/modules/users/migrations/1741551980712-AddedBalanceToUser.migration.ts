import { Logger } from '@nestjs/common';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedBalanceToUser1741551980712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    Logger.log(
      `🤖🤖🤖🤖🤖🤖🤖🤖 Running migration AddedBalanceToUser1741551980712`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "balance" float DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    Logger.log(
      `🤖🤖🤖🤖🤖🤖🤖🤖 Rollback migration AddedBalanceToUser1741551980712`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balance"`);
  }
}
