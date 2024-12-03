var express = require('express');
const userController = require("../controllers/userController")

var isAuth = require('../middleware/is-auth');
const { checker } = require('../middleware/bodyChecker');
const { check } = require('express-validator');
const { Messages } = require('../helper/Constant');

var router = express.Router();

router.get("/", userController.healthCheck)

router.post(
    "/signup",
    [
        check("email").notEmpty().withMessage(Messages.REQUIRED),
        check("password").notEmpty().withMessage(Messages.REQUIRED),
    ],
    checker,
    userController.signup
)

router.post(
    "/login",
    [
        check("email").notEmpty().withMessage(Messages.REQUIRED),
        check("password").notEmpty().withMessage(Messages.REQUIRED),
    ],
    checker,
    userController.login
)

router.post(
    "/updateProfile",
    isAuth,
    userController.updateProfile
)

router.get(
    "/getProfile",
    isAuth,
    userController.getProfile
)


router.get(
    "/getAllAppointments",
    isAuth,
    userController.getAllAppointments
)

router.get(
    "/getAllDoctorAndClinics",
    isAuth,
    userController.getAllDoctorAndClinics
)

router.post(
    "/bookAppointment",
    [
        check("doctor_id").notEmpty().withMessage(Messages.REQUIRED),
        check("clinic_id").notEmpty().withMessage(Messages.REQUIRED),
        check("service_id").notEmpty().withMessage(Messages.REQUIRED),
        check("appoinment_date").notEmpty().withMessage(Messages.REQUIRED),
    ],
    checker,
    isAuth,
    userController.bookAndUpdateAppointment
)

router.delete(
    "/cancelAppointmentById",
    [
        check("id").notEmpty().withMessage(Messages.REQUIRED),
    ],
    checker,
    isAuth,
    userController.cancelAppointmentById
)

router.post(
    "/createOrUpdateReviewRating",
    [
        check("doctor_id").notEmpty().withMessage(Messages.REQUIRED),
        check("rating").notEmpty().withMessage(Messages.REQUIRED),
        check("description").notEmpty().withMessage(Messages.REQUIRED),
    ],
    checker,
    isAuth,
    userController.createOrUpdateReviewRating
)

router.get(
    "/getAllUsersRatingToDoctor",
    [
        check("doctor_id").notEmpty().withMessage(Messages.REQUIRED),
    ],
    checker,
    isAuth,
    userController.getAllUsersRatingToDoctor
)


module.exports = router