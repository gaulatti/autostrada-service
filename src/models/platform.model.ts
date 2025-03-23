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
  tableName: 'platforms',
  timestamps: true,
  underscored: true,
})
export class Platform extends Model<Platform, CreationOptional<Platform>> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: CreationOptional<number>;

  @Column({
    type: DataType.ENUM('desktop', 'mobile'),
    allowNull: false,
  })
  type!: 'desktop' | 'mobile';

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  user_agent!: string;

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
