import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { CoreWebVitals } from './core.web.vitals.model';
import { Grade } from './grade.model';
import { Platform } from './platform.model';
import { Provider } from './provider.model';
import { Pulse } from './pulse.model';

/**
 * Define the full attributes of the model
 */
export interface HeartbeatAttributes {
  id: number;
  pulses_id: number;
  platforms_id: number;
  provider_id: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Define the attributes needed when creating a new record
 */
export type HeartbeatCreationAttributes = Optional<
  HeartbeatAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'slug'
>;

@Table({
  tableName: 'heartbeats',
  timestamps: true,
  underscored: true,
})
export class Heartbeat
  extends Model<HeartbeatAttributes, HeartbeatCreationAttributes>
  implements HeartbeatAttributes
{
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Pulse)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  pulses_id!: number;

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
    type: DataType.STRING(36),
    allowNull: false,
    unique: true,
  })
  slug!: string;

  @HasOne(() => Grade)
  grades!: Grade;

  @HasOne(() => CoreWebVitals)
  cwv!: CoreWebVitals;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;

  @BelongsTo(() => Pulse)
  pulse?: Pulse;

  @BelongsTo(() => Platform)
  platform?: Platform;

  @BelongsTo(() => Provider)
  provider?: Provider;
}
