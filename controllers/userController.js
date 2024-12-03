const { Messages } = require("../helper/Constant");
const Clinics = require("../models/clinics");
const Doctors = require("../models/doctors");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Appointments = require("../models/appointment");
const Services = require("../models/services");
const { Op, fn, col, literal } = require("sequelize");
const { generateRegestrationNumber } = require("../helper/helperFunctions");
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

        const isExist = await User.findOne({ where: { email, isActive: true } });
        if (isExist) return res.status(400).json({ status: 0, message: Messages.ALREADY_EXISTS });

        const hashPass = await bcrypt.hash(password, 10);

        const newCreate = await User.create({
            email,
            password: hashPass,
        });
        const token = jwt.sign({ id: newCreate.id, role: "user" }, process.env.JWT_KEY);

        res.status(201).json({
            status: 1,
            message: Messages.CREATED_SUCCESS,
            token,
            data: { user: newCreate },
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

        const user = await User.findOne({ where: { email, isActive: true } });
        if (!user) return res.status(400).json({ status: 0, message: Messages.EMAIL_NOT_FOUND });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ status: 0, message: Messages.PASSWORD_NOT_MATCH });

        const token = jwt.sign({ id: user.id, role: "user" }, process.env.JWT_KEY);

        res.status(200).json({
            status: 1,
            message: Messages.SUCCESS,
            token,
        });

    } catch (error) {
        res.status(500).json({
            status: 0,
            message: Messages.SOMETHING_WENT_WRONG,
        });
    }
}


exports.updateProfile = async (req, res, next) => {
    try {

        const { id, role } = req;
        if (!(role == "user")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

        const findUser = await User.findOne({ where: { id, id } });
        if (!findUser) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

        const updateKeys = ["first_name", "last_name", "profilePic", "address", "age"]

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

exports.getProfile = async (req, res, next) => {
    try {
        const { id, role } = req;
        if (!(role == "user")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

        const findUser = await User.findOne({ where: { id, isActive: true } });
        if (!findUser) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

        res.status(200).json({ status: 1, message: Messages.SUCCESS, data: findUser });

    } catch (error) {
        res.status(500).json({
            status: 0,
            message: Messages.SOMETHING_WENT_WRONG,
        });
    }
}

exports.getAllAppointments = async (req, res, next) => {
    try {
        const { id, role } = req;

        if (!(role == "user")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

        const appointments = await Appointments.findAll({
            where: { user_id: id, isActive: true },
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Doctors,
                },
                {
                    model: Services,
                },
                {
                    model: Clinics,
                }
            ]
        });

        res.status(200).json({ status: 1, message: Messages.SUCCESS, appointments: appointments });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 0,
            message: Messages.SOMETHING_WENT_WRONG,
        });
    }
}

exports.getAllDoctorAndClinics = async (req, res, next) => {
    try {
        const { id, role } = req;
        const { search } = req.query;

        if (!(role == "user")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

        const findAllDoctors = await Services.findAll({
            where: {
                isActive: true,
                [Op.or]: [
                    { service_name: { [Op.iLike]: `%${search}%` } }
                ],
                availability: true
            },
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Clinics,
                    where: { isActive: true },
                    required: true,
                    include: [
                        {
                            model: Doctors,
                            where: { isActive: true, status: "approved" },
                            required: true,
                            attributes: ["first_name", "last_name", "email", "specialization","availability"],
                            include: [
                                {
                                    model: ReviewRating,
                                    where: { isActive: true },
                                    attributes: ["description", "rating","user_id"],
                                    include: [
                                        {
                                            model: User,
                                            where: { isActive: true },
                                            attributes: ["first_name", "last_name"]
                                        }
                                    ],
                                    required: false,
                                },
                            ]   
                        },
                    ],
                },
                
            ],
        });  

        // const findAllDoctors = await Services.findAll({
        //     where: {
        //         isActive: true,
        //         [Op.or]: [
        //             { service_name: { [Op.iLike]: `%${search}%` } }
        //         ]
        //     },
        //     order: [["createdAt", "DESC"]],
        //     include: [
        //         {
        //             model: Clinics,
        //             where: { isActive: true },
        //             required: true,
        //             include: [
        //                 {
        //                     model: Doctors,
        //                     where: { isActive: true },
        //                     required: true,
        //                     attributes: [
        //                         "first_name",
        //                         "last_name",
        //                         "email",
        //                         "specialization",
        //                         "availability",
        //                         [fn("AVG", col("Clinics.Doctors.ReviewRating.rating")), "averageRating"],
        //                         [fn("COUNT", col("Clinics.Doctors.ReviewRating.id")), "totalReviews"]
        //                     ],
        //                     include: [
        //                         {
        //                             model: ReviewRating,
        //                             where: { isActive: true },
        //                             attributes: ["description", "rating", "user_id"],
        //                             include: [
        //                                 {
        //                                     model: User,
        //                                     where: { isActive: true },
        //                                     attributes: ["first_name", "last_name"]
        //                                 }
        //                             ]
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ],
        //     group: [
        //         "Services.id",
        //         "Clinics.id",
        //         "Doctors.id",
        //         "ReviewRating.id",
        //         "ReviewRating.User.id"
        //     ]
        // });

        res.status(200).json({ status: 1, message: Messages.SUCCESS, services: findAllDoctors });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            message: Messages.SOMETHING_WENT_WRONG,
            error: error.message
        });
    }
}

exports.bookAndUpdateAppointment = async (req, res, next) => {
    try {
        const { id, role } = req;
        const { id: appointment_id, doctor_id, clinic_id, service_id, appoinment_date } = req.body;

        if (!(role == "user")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

        let lastest_registration_number = "R-000001"

        const findLatest = await Appointments.findOne({ order: [["createdAt", "DESC"]] })
        if (findLatest) {
            lastest_registration_number = generateRegestrationNumber(findLatest.registration_number);
        }

        const findService = await Services.findOne({ where: { id: service_id, isActive: true } });

        if (!findService) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

        const appointment = await Appointments.create({
            user_id: id,
            doctor_id,
            clinic_id,
            service_id,
            appoinment_date,
            price: findService.price,
            registration_number: lastest_registration_number,
        });

        res.status(201).json({ status: 1, message: Messages.CREATED_SUCCESS, appointment: appointment });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            message: Messages.SOMETHING_WENT_WRONG,
        });
    }
}

exports.cancelAppointmentById = async (req, res, next) => {
    try {
        const { id, role } = req;
        const { id: appointment_id } = req.query;

        if (!(role == "user")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

        const appointment = await Appointments.findByPk(appointment_id);
        if (!appointment) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

        appointment.isActive = false;
        await appointment.save();

        res.status(200).json({ status: 1, message: Messages.UPDATED_SUCCESS, appointment: appointment });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            message: Messages.SOMETHING_WENT_WRONG,
        });
    }
}

exports.createOrUpdateReviewRating = async (req, res, next) => {
    try {
        const { id, role } = req;
        const { doctor_id } = req.body;

        if (!(role == "user")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

        let isCreated = false

        let findReview = await ReviewRating.findOne({ where: { doctor_id: doctor_id, user_id: id, isActive: true } })
        if (!findReview) {
            findReview = ReviewRating.build({ doctor_id: doctor_id, user_id: id });
            isCreated = true
        }

        let updateKeys = ["description", "rating"];

        updateKeys.forEach(function (key) {
            if (req.body[key] !== undefined) {
                findReview[key] = req.body[key];
            }
        });


        await findReview.save();
        res.status(200).json({ status: 1, message: isCreated ? Messages.CREATED_SUCCESS : Messages.UPDATED_SUCCESS });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 0,
            message: Messages.SOMETHING_WENT_WRONG
        })
    }
}


exports.getAllUsersRatingToDoctor = async (req, res, next) => {
    try {
        const { id, role } = req;
        const { doctor_id } = req.query;

        if (!(role == "user")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

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

