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
import { Platform } from './platform.model';
import { Provider } from './provider.model';
import { Url } from './url.model';

/**
 * Define the full attributes of the Performance model
 */
export interface PerformanceAttributes {
  id: number;
  url_id: number;
  platforms_id: number;
  provider_id: number;
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
export type PerformanceCreationAttributes = Optional<
  PerformanceAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

@Table({
  tableName: 'performance',
  timestamps: true,
  underscored: true,
})
export class Performance
  extends Model<PerformanceAttributes, PerformanceCreationAttributes>
  implements PerformanceAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Url)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  url_id!: number;

  @ForeignKey(() => Platform)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  platforms_id!: number;

  @ForeignKey(() => Provider)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  provider_id!: number;

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

  // Define associations
  @BelongsTo(() => Url)
  url?: Url;

  @BelongsTo(() => Platform)
  platform?: Platform;

  @BelongsTo(() => Provider)
  provider?: Provider;
}
