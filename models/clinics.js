const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Clinics = sequelize.define("clinics", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  clinic_name: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  address: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  phone_number: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },
  doctor_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  description: {
    type: Sequelize.STRING(500),
    allowNull: true,
    defaultValue: "",
  }
});

module.exports = Clinics;