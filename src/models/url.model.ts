import { CreationOptional } from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Junction } from './junction.model';
import { Pulse } from './pulse.model';

@Table({
  tableName: 'urls',
  timestamps: true,
  underscored: true,
})
export class Url extends Model<Url, CreationOptional<Url>> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: CreationOptional<number>;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  url!: string;

  @Column({
    type: DataType.STRING(36),
    allowNull: false,
    unique: true,
  })
  slug!: string;

  @HasMany(() => Pulse)
  pulses!: Pulse[];

  @HasMany(() => Junction)
  junctions!: Junction[];

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;
}
