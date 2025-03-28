import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Url } from './url.model';
import { Heartbeat } from './heartbeat.model';

/**
 * Full attributes for Pulse
 */
export interface PulseAttributes {
  id: number;
  url_id: number;
  slug: string;
  playlist_slug: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
 * Attributes required when creating a Pulse record
 */
export type PulseCreationAttributes = Optional<
  PulseAttributes,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

@Table({
  tableName: 'pulses',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Pulse
  extends Model<PulseAttributes, PulseCreationAttributes>
  implements PulseAttributes
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

  @Column({
    type: DataType.STRING(36),
    allowNull: false,
    unique: true,
  })
  slug!: string;

  @Column({
    type: DataType.STRING(36),
    allowNull: false,
    unique: true,
  })
  playlist_slug!: string;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;

  @DeletedAt
  @Column({ field: 'deleted_at', type: DataType.DATE })
  deletedAt!: Date;

  @HasMany(() => Heartbeat)
  heartbeats!: Heartbeat[];

  @BelongsTo(() => Url)
  url?: Url;
}
