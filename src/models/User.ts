import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public role!: string;
  public password!: string;
  public refresh_token!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    role: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    refresh_token: {
      type: new DataTypes.TEXT(),
      allowNull: true,
    },
  },
  {
    tableName: "Users",
    sequelize,
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

export default User;
