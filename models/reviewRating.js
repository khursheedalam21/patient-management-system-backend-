const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ReviewRating = sequelize.define("reviewRating", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
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

  doctor_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  user_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  rating: {
    type: Sequelize.INTEGER,
    allowNull: true,
  }

});



module.exports = ReviewRating;