import { Optional } from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Heartbeat } from './heartbeat.model';

/**
 * Define the full attributes of the model
 */
export interface GradeAttributes {
  id: number;
  heartbeats_id: number;
  performance: number;
  accessibility: number;
  seo: number;
  best_practices: number;
  security?: number;
  aesthetics?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Define the attributes needed when creating a new record
 */
export type GradeCreationAttributes = Optional<
  GradeAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'grades',
  timestamps: true,
  underscored: true,
})
export class Grade
  extends Model<GradeAttributes, GradeCreationAttributes>
  implements GradeAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Heartbeat)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  heartbeats_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  performance!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  accessibility!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  seo!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  best_practices!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  security!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  aesthetics!: number;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;
}
