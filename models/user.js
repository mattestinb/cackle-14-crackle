const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

// User class extending Model
class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// Define the schema for User
const userSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8],
    },
  },
};

// Password hashing hooks
const hashPassword = async (userData) => {
  userData.password = await bcrypt.hash(userData.password, 10);
  return userData;
};

// Model configuration
const userConfig = {
  hooks: {
    beforeCreate: hashPassword,
    beforeUpdate: hashPassword,
  },
  sequelize,
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  modelName: "user",
};

// Initialize User model
User.init(userSchema, userConfig);

// Export
module.exports = User;



