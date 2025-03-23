import { CreationOptional } from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

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

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt!: Date;
}
