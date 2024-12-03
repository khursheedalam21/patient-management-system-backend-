const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Appointments = sequelize.define("appointments", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  registration_number: {
    type: Sequelize.STRING(100),
    allowNull: true,
  },

  user_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  clinic_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  doctor_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  appoinment_date: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },

  service_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  prescription: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },

  status: {
    type: Sequelize.STRING(100),
    allowNull: true,
    defaultValue: "booked",
  },

});

module.exports = Appointments;