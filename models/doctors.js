const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Doctors = sequelize.define("doctors", {
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

  age: {
    type: Sequelize.INTEGER,
    allowNull: true,
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
    type: Sequelize.STRING(200),
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

  specialization: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },

  availability: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },

  status: {
    type: Sequelize.STRING(20),
    defaultValue: "created",
  }

});



module.exports = Doctors;