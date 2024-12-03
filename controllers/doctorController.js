const { Messages } = require("../helper/Constant");
const Clinics = require("../models/clinics");
const Doctors = require("../models/doctors");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const Services = require("../models/services");
const Appointments = require("../models/appointment");
const User = require("../models/user");

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

    const isExist = await Doctors.findOne({ where: { email, isActive: true } });
    if (isExist) return res.status(400).json({ status: 0, message: Messages.ALREADY_EXISTS });

    const hashPass = await bcrypt.hash(password, 10);

    const doctor = await Doctors.create({
      email,
      password: hashPass,
    });

    const clinicCreate = await Clinics.create({ doctor_id: doctor.id });

    const token = jwt.sign({ id: doctor.id, role: "doctor" }, process.env.JWT_KEY);

    res.status(201).json({
      status: 1,
      message: Messages.CREATED_SUCCESS,
      token,
      data: { doctor: doctor, clinic: clinicCreate },
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctors.findOne({ where: { email, isActive: true } });
    if (!doctor) return res.status(400).json({ status: 0, message: Messages.EMAIL_NOT_FOUND });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ status: 0, message: Messages.PASSWORD_NOT_MATCH });

    const token = jwt.sign({ id: doctor.id, role: "doctor" }, process.env.JWT_KEY);

    res.status(200).json({
      status: 1,
      message: Messages.SUCCESS,
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


exports.updateProfile = async (req, res, next) => {
  try {

    const { id, role } = req;
    const { availability } = req.body;

    if (!(role == "doctor")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

    const findDoctor = await Doctors.findOne({ where: { id, id } });
    if (!findDoctor) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    const updateKeys = ["first_name", "last_name", "age", "specialization", "profilePic", "availability"]

    const clinicUpdateKeys = ["clinic_name", "address", "phone_number", "description"]

    updateKeys.forEach((key) => {
      if (req.body[key]) findDoctor[key] = req.body[key];
    });

    if (typeof availability === "boolean") {
      findDoctor.availability = availability;
    }

    const findClinic = await Clinics.findOne({
      where: { doctor_id: findDoctor.id, }
    });

    if (!findClinic) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    clinicUpdateKeys.forEach((key) => {
      if (req.body[key]) findClinic[key] = req.body[key];
    });

    await findDoctor.save();
    await findClinic.save();

    res.status(200).json({ status: 1, message: Messages.UPDATED_SUCCESS, data: { doctor: findDoctor, clinic: findClinic } });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}

exports.getProfile = async (req, res, next) => {
  try {

    const { id, role } = req;

    if (!(role == "doctor")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

    const findDoctor = await Doctors.findOne({ where: { id, isActive: true } });
    if (!findDoctor) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    const findClinic = await Clinics.findOne({
      where: { doctor_id: findDoctor.id, }
    });

    res.status(200).json({ status: 1, message: Messages.SUCCESS, data: { doctor: findDoctor, clinic: findClinic } });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}

exports.createOrUpdateService = async (req, res, next) => {
  try {
    const { id, role } = req;

    if (!(role == "doctor")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

    const { id: service_id, service_name, description, availability, price } = req.body;

    const findDoctor = await Doctors.findOne({ where: { id, isActive: true } });
    if (!findDoctor) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    const findClinic = await Clinics.findOne({
      where: {
        doctor_id: findDoctor.id,
        isActive: true,
      }
    });
    if (!findClinic) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    let findService = await Services.findOne({
      where: {
        ...(service_id ? { id: service_id } : { service_name }),
        isActive: true,
        clinic_id: findClinic.id,
      }
    });

    if (service_id) {
      if (!findService) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });
    } else {
      if (findService) return res.status(400).json({ status: 0, message: Messages.ALREADY_EXISTS });
      findService = Services.build({ clinic_id: findClinic.id })
    }

    findService.service_name = service_name;
    findService.description = description;
    findService.availability = availability;
    findService.price = price;

    await findService.save();

    res.status(200).json({ status: 1, message: service_id ? Messages.UPDATED_SUCCESS : Messages.CREATED_SUCCESS, data: findService })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}

exports.getAllServices = async (req, res, next) => {
  try {

    const { id, role } = req;


    if (!(role == "doctor")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

    const findDoctor = await Doctors.findOne({ where: { id, isActive: true } });
    if (!findDoctor) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    const findClinic = await Clinics.findOne({
      where: { doctor_id: findDoctor.id }
    });
    if (!findClinic) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    const services = await Services.findAll({
      where: { clinic_id: findClinic.id, isActive: true },
    });

    res.status(200).json({ status: 1, message: Messages.SUCCESS, services: services });

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

    if (!(role == "doctor")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

    const findDoctor = await Doctors.findOne({ where: { id, isActive: true } });
    if (!findDoctor) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    const findClinic = await Clinics.findOne({
      where: { doctor_id: findDoctor.id, }
    });
    if (!findClinic) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    const appointments = await Appointments.findAll({
      where: { clinic_id: findClinic.id, isActive: true },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Services,
        },
        {
          model: User,
        }
      ]

    });

    res.status(200).json({ status: 1, message: Messages.SUCCESS, appointments: appointments });

  } catch (error) {
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id, role } = req;

    if (!(role == "doctor")) return res.status(400).json({ status: 0, message: Messages.BAD_REQUEST })

    const { id: appointment_id, status, prescription } = req.body;

    const findDoctor = await Doctors.findOne({ where: { id, isActive: true } });
    if (!findDoctor) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    const findAppointment = await Appointments.findOne({ where: { id: appointment_id, doctor_id: findDoctor.id, isActive: true } });
    if (!findAppointment) return res.status(400).json({ status: 0, message: Messages.DATA_NOT_FOUND });

    if (status === "attended") findAppointment.prescription = prescription;
    findAppointment.status = status;
    await findAppointment.save();

    res.status(200).json({ status: 1, message: Messages.UPDATED_SUCCESS });

  } catch (error) {
    res.status(500).json({
      status: 0,
      message: Messages.SOMETHING_WENT_WRONG,
    });
  }
}