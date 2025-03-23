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
import { Cluster } from './cluster.model';
import { Url } from './url.model';

@Table({
  tableName: 'junctions',
  timestamps: true,
  underscored: true,
})
export class Junction extends Model<Junction, CreationOptional<Junction>> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: CreationOptional<number>;

  @ForeignKey(() => Cluster)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clusters_id!: number;

  @ForeignKey(() => Url)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  urls_id!: number;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;

  @BelongsTo(() => Cluster)
  cluster?: Cluster;

  @BelongsTo(() => Url)
  url?: Url;
}
