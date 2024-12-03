const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Services = sequelize.define("services", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  service_name: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },

  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },

  description: {
    type: Sequelize.STRING(500),
    allowNull: true,
    defaultValue: "",
  },

  availability: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  },

  clinic_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  price: {
    type: Sequelize.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: true,
  }
});



module.exports = Services;