const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true
  },

  password: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },

  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },

  profilePic: {
    type: Sequelize.STRING(100),
    allowNull: true,
    defaultValue: "",
  },

  first_name: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },

  last_name: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },

  address: {
    type: Sequelize.STRING(250),
    allowNull: true,
    defaultValue: "",
  },

  age: {
    type: Sequelize.INTEGER,
    allowNull: true,
  }
});



module.exports = User;
