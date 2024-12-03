const usersModel = require("../models/user");
const adminModel = require("../models/admin");
const doctorModel = require("../models/doctors");
const clinicsModel = require("../models/clinics");
const serviceModel = require("../models/services");
const appointmentModel = require("../models/appointment");
const reviewRatingModel = require("../models/reviewRating");


doctorModel.hasOne(clinicsModel, {
  foreignKey: {
    name: "doctor_id"
  }
});
clinicsModel.hasMany(serviceModel, {
  foreignKey: {
    name: "clinic_id"
  }
});
clinicsModel.hasMany(appointmentModel, {
  foreignKey: {
    name: "clinic_id"
  }
});
doctorModel.hasMany(appointmentModel, {
  foreignKey: {
    name: "doctor_id"
  }
});

usersModel.hasMany(appointmentModel, {
  foreignKey: {
    name: "user_id"
  }
})

usersModel.hasMany(reviewRatingModel, {
  foreignKey: {
    name: "user_id"
  }
})

doctorModel.hasMany(reviewRatingModel, {
  foreignKey: {
    name: "doctor_id",
  }
})

appointmentModel.belongsTo(clinicsModel, {
  foreignKey: "clinic_id",
});

appointmentModel.belongsTo(doctorModel, {
  foreignKey: "doctor_id",
});

appointmentModel.belongsTo(usersModel, {
  foreignKey: "user_id",
});

appointmentModel.belongsTo(serviceModel, {
  foreignKey: "service_id",
});

reviewRatingModel.belongsTo(usersModel, {
  foreignKey: "user_id",
});

serviceModel.belongsTo(clinicsModel, {
  foreignKey: "clinic_id",
});

clinicsModel.belongsTo(doctorModel, {
  foreignKey: "doctor_id",
});





