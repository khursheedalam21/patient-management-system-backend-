var express = require('express');
const adminController = require("../controllers/adminController")

var isAuth = require('../middleware/is-auth');
const { checker } = require('../middleware/bodyChecker');
const { check } = require('express-validator');
const { Messages } = require('../helper/Constant');

var router = express.Router();

router.get("/", adminController.healthCheck)

router.post(
  "/signup",
  [
    check("email").notEmpty().withMessage(Messages.REQUIRED),
    check("password").notEmpty().withMessage(Messages.REQUIRED),
  ],
  checker,
  adminController.signup
)

router.post(
  "/login",
  [
    check("email").notEmpty().withMessage(Messages.REQUIRED),
    check("password").notEmpty().withMessage(Messages.REQUIRED),
  ],
  checker,
  adminController.login
)

router.get(
  "/getAllDoctors",
  isAuth,
  adminController.getAllDoctors
)

router.get(
  "/getAllUsersRatingToDoctor",
  check("doctor_id").notEmpty().withMessage(Messages.REQUIRED),
  checker,
  isAuth,
  adminController.getAllUsersRatingToDoctor
)

router.post(
  "/updateDoctorStatus",
  check("status").notEmpty().withMessage(Messages.REQUIRED),
  check("id").notEmpty().withMessage(Messages.REQUIRED),
  checker,
  isAuth,
  adminController.updateDoctorStatus
)


module.exports = router