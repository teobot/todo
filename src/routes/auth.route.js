const config = require("../config/config");

const version = config.get("version");

const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.route("/api/" + version + "/auth/login").post(controller.login);
  app.route("/api/" + version + "/auth/create").post(controller.create);
};
