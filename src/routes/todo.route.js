const config = require("../config/config");

const version = config.get("version");

const controller = require("../controllers/todo.controller");

const requireAuth = require("../middlewares/requireAuth")

module.exports = function (app) {
  // create a todo item
  app.route("/api/" + version + "/todo/create").post(requireAuth, controller.createTodo);

  // get todo items
  app.route("/api/" + version + "/todo/get").get(requireAuth, controller.getTodos);

  // mark a todo as complete
  app.route("/api/" + version + "/todo/complete").patch(requireAuth, controller.markAsComplete);

  // delete a todo
  app.route("/api/" + version + "/todo/delete").delete(requireAuth, controller.deleteTodo);

  // edit a todo text
  app.route("/api/" + version + "/todo/edit").patch(requireAuth, controller.editTodo);

};
