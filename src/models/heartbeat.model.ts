import { CreationOptional } from 'sequelize';
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
import { Pulse } from './pulse.model';

@Table({
  tableName: 'heartbeats',
  timestamps: true,
  underscored: true,
})
export class Heartbeat extends Model<Heartbeat, CreationOptional<Heartbeat>> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: CreationOptional<number>;

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
