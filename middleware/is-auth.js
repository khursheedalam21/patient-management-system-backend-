const jwt = require("jsonwebtoken");
const { Messages } = require("../helper/Constant");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  req.forbidden = true;

  if (!authHeader) {
    req.isAuth = false;
    return res.json({ status: 0, message: Messages.NOT_AUTHORIZED });
  }
  const token = authHeader.split(" ")[1]; // Authorization: Bearer asdmaklsda
  if (!token || token === "") {
    req.isAuth = false;
    return res.json({ status: 0, message: Messages.NOT_AUTHORIZED });
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    req.isAuth = false;
    return res.json({ status: 0, message: Messages.NOT_AUTHORIZED });
  }
  if (!decodedToken) {
    req.isAuth = false;
    return res.json({ status: 0, message: Messages.NOT_AUTHORIZED });
  }
  req.isAuth = true;
  req.id = decodedToken.id;
  req.role = decodedToken.role;
  req.token = token;
  if (req.isAuth) {
    next();
  } else {
    return res.json({ status: 0, message: Messages.NOT_AUTHORIZED });
  }
};
