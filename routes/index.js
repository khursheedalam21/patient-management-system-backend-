const helperRoutes = require("./helperRoute");
const doctorRoutes = require("./doctorRoute");
const userRoutes = require("./userRoute");
const adminRoutes = require("./adminRoute");

const router = require("express").Router();

router.use("/helper", helperRoutes);
router.use("/doctor", doctorRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);

module.exports = router;