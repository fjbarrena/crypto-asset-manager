import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  /**
   * Username that created the row
   * NOTE: we use username and not uuid to avoid table joins, we dont want all the data of the
   * user who created it, we just want to know WHO created it
   */
  @Column({
    type: 'varchar',
    nullable: true,
  })
  created_by: string;

  @UpdateDateColumn()
  modified_at: Timestamp;

  /**
   * Username that modified the row
   * NOTE: same idea here :)
   */
  @Column({
    type: 'varchar',
    nullable: true,
  })
  modified_by: string;
}
