const { Messages } = require("../helper/Constant");
const sequelize = require("../util/database")

exports.dbSync = async (req, res, next) => {
  try {
    const data = await sequelize.sync({ alter: true });

    console.log(data);

    res.status(200).json({
      status: 1,
      message: Messages.DB_SYNC_SUCCESS,
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 0, message: error.message });
  }
}
