const dotenv = require("dotenv");
const path = require("path")

dotenv.config({
  path: "./opt/demo/.env",
});

const bodyParser = require("body-parser");
var express = require("express");
const sequelize = require("./util/database"); ``
const logger = require("morgan");
const cors = require("cors");

var app = express();

app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(cors())

app.use(express.json());

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(logger("dev"));

const { Messages } = require("./helper/Constant");
require("./helper/modelAssociation")

app.get("/", (req, res) => {
  res.send(Messages.HEALTH_OK);
})

app.use("/api", require("./routes") );


app.start = app.listen = function () {
  return server.listen.apply(server, arguments);
};

sequelize.authenticate()
  .then(() => {
    console.log(Messages.DB_CONNECTED);
  })
  .catch(err => {
    console.error(Messages.DB_CONNECTED_FAILED, err);
  });


module.exports = app;
