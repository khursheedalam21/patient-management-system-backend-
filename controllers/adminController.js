const { Messages } = require("../helper/Constant");
const Clinics = require("../models/clinics");
const Doctors = require("../models/doctors");
const User = require("../models/user");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Services = require("../models/services");
const { Op, fn, col, literal } = require("sequelize");
const ReviewRating = require("../models/reviewRating");

exports.healthCheck = async (req, res, next) => {
  try {

    res.status(200).json({
      status: 1,
      message: Messages.HEALTH_OK,
    });

  } catch (error) {
    res.status(500).json({ status: 0, message: error.message });
  }
}

exports.signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isExist = await Admin.findOne({ where: { email, isActive: true } });
    if (isExist) return res.status(400).json({ status: 0, message: Messages.ALREADY_EXISTS });

    const hashPass = await bcrypt.hash(password, 10);

    const newCreate = await Admin.create({
      email,
      password: hashPass,
    });

    const token = jwt.sign({ id: newCreate.id, role: "admin" }, process.env.JWT_KEY);


    res.status(201).json({
      status: 1,
      message: Messages.CREATED_SUCCESS,
      token,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email, isActive: true } });
    if (!admin) return res.status(400).json({ status: 0, message: Messages.EMAIL_NOT_FOUND });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ status: 0, message: Messages.PASSWORD_NOT_MATCH });

    const token = jwt.sign({ id: admin.id, role: "admin" }, process.env.JWT_KEY);

    res.status(200).json({
      status: 1,
      message: Messages.SUCCESS,
      token,
    });

  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}


exports.updateProfile = async (req, res, next) => {
  try {

    const { id, role } = req;
    if (!(role == "admin")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

    const findUser = await Admin.findOne({ where: { id, id } });
    if (!findUser) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    const updateKeys = ["email"]

    updateKeys.forEach(function (key) {
      if (req.body[key] !== undefined) {
        findUser[key] = req.body[key];
      }
    });

    await findUser.save();

    res.status(200).json({ status: 1, message: Messages.UPDATED_SUCCESS, data: findUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}

exports.getAllDoctors = async (req, res, next) => {
  try {
    const { id, role } = req;
    if (!(role == "admin")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })
    const { search } = req.query;

    const findAllDoctors = await Doctors.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { first_name: { [Op.iLike]: `%${search}%` } }
        ]
      },
      order: [["createdAt", "DESC"]],
      attributes: {
        include: [
          [fn('COUNT', col('reviewRatings.id')), 'reviewCount'],
          [literal('ROUND(AVG("reviewRatings"."rating"), 2)'), 'averageRating'],
        ],
      },
      include: [
        {
          model: Clinics,
          where: { isActive: true },
          required: true,
          include: [
            {
              model: Services,
              where: { isActive: true },
              required: true,
            },
          ],
        },
        {
          model: ReviewRating,
          attributes: [],
          where: { isActive: true },
          required: false,
        }
      ],
      group: [
        'doctors.id',
        'clinic.id',
        'clinic->services.id'
      ]
    });

    res.status(200).json({ status: 1, message: Messages.SUCCESS, doctors: findAllDoctors });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}


exports.getAllUsersRatingToDoctor = async (req, res, next) => {
  try {
    const { id, role } = req;
    const { doctor_id } = req.query;

    if (!(role == "admin")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

    const reviews = await ReviewRating.findAll({
      where: { doctor_id: doctor_id, isActive: true },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "first_name", "last_name", "profilePic"],
        }
      ]
    });

    res.status(200).json({ status: 1, message: Messages.SUCCESS, reviews: reviews });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING
    })
  }
}

exports.updateDoctorStatus = async (req, res, next) => {
  try {

    const { id, role } = req;
    if (!(role == "admin")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST });

    const { id: doctor_id, status } = req.body;

    const findDoctor = await Doctors.findOne({ where: { id: doctor_id, isActive: true } });
    if (!findDoctor) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    findDoctor.status = status;

    await findDoctor.save();

    res.status(200).json({ status: 1, message: Messages.UPDATED_SUCCESS, data: findDoctor });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}

