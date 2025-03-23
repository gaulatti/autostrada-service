import { CreationOptional } from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Url } from './url.model';

@Table({
  tableName: 'pulses',
  timestamps: true,
  underscored: true,
  paranoid: true,
})
export class Pulse extends Model<Pulse, CreationOptional<Pulse>> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: CreationOptional<number>;

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

  @BelongsTo(() => Url)
  url?: Url;
}
