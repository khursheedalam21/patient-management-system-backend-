const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Admin = sequelize.define("admin", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING(100),
    defaultValue: "",
    allowNull: false,
  },

  password: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue:true
  }

});

// Admin.sync()
module.exports = Admin

