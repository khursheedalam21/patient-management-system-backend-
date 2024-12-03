var express = require('express');
const doctorController = require("../controllers/doctorController")

var isAuth = require('../middleware/is-auth');
const { checker } = require('../middleware/bodyChecker');
const { check } = require('express-validator');
const { Messages } = require('../helper/Constant');

var router = express.Router();

router.get("/", doctorController.healthCheck)

router.post(
  "/signup",
  [
    check("email").notEmpty().withMessage(Messages.REQUIRED),
    check("password").notEmpty().withMessage(Messages.REQUIRED),
  ],
  checker,
  doctorController.signup
)

router.post(
  "/login",
  [
    check("email").notEmpty().withMessage(Messages.REQUIRED),
    check("password").notEmpty().withMessage(Messages.REQUIRED),
  ],
  checker,
  doctorController.login
)

router.post(
  "/updateProfile",
  isAuth,
  doctorController.updateProfile
)

router.get(
  "/getProfile",
  isAuth,
  doctorController.getProfile
)

router.post(
  "/createOrUpdateService",
  [
    check("service_name").notEmpty().withMessage(Messages.REQUIRED),
    check("description").notEmpty().withMessage(Messages.REQUIRED),
    check("availability").isBoolean(),
    check("price").notEmpty().withMessage(Messages.REQUIRED),
  ],
  checker,
  isAuth,
  doctorController.createOrUpdateService
)

router.get(
  "/getAllServices",
  isAuth,
  doctorController.getAllServices
)

router.get(
  "/getAllAppointments",
  isAuth,
  doctorController.getAllAppointments
)

router.post(
  "/updateAppointmentStatus",
  [
    check("status").notEmpty().withMessage(Messages.REQUIRED),
    // check("prescription").notEmpty().withMessage(Messages.REQUIRED),
    check("id").notEmpty().withMessage(Messages.REQUIRED)
  ],
  checker,
  isAuth,
  doctorController.updateAppointmentStatus
)

module.exports = router