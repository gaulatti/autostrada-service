import { Optional } from 'sequelize';
import {
  BelongsTo,
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
export interface CoreWebVitalsAttributes {
  id: number;
  heartbeats_id: number;
  ttfb: number;
  fcp: number;
  dcl: number;
  lcp: number;
  tti: number;
  si: number;
  cls: string;
  tbt: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Define the attributes needed when creating a new record
 */
export type CoreWebVitalsCreationAttributes = Optional<
  CoreWebVitalsAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'cwv',
  timestamps: true,
  underscored: true,
})
export class CoreWebVitals
  extends Model<CoreWebVitalsAttributes, CoreWebVitalsCreationAttributes>
  implements CoreWebVitalsAttributes
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
  ttfb!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  fcp!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  dcl!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  lcp!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  tti!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  si!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: '0.00',
  })
  cls!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  tbt!: number;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;

  @BelongsTo(() => Heartbeat)
  heartbeat?: Heartbeat;
}
