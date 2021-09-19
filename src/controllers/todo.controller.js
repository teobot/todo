// Require config
const config = require("../config/config");

// require auth
const auth = require("../middlewares/requireAuth");

// Import JWT
var jwt = require("jsonwebtoken");

// Check if dates are on the same day
const { datesAreOnSameDay } = require("../functions/general.functions");

const createTodo = async (req, res) => {
  const user = req.user;

  const todoText = req.body.text;

  let newDate = new Date();

  // add a day
  //date.setDate(date.getDate() - 16);

  const todayTodo = user.todos.find((todo) =>
    datesAreOnSameDay(new Date(todo.date), newDate)
  );

  if (!todayTodo) {
    user.todos.push({ date: newDate, items: [] });
  }

  user.todos
    .find((todo) => datesAreOnSameDay(new Date(todo.date), newDate))
    .items.unshift({ text: todoText });

  await user.save();

  return res.send({
    _id: user._id,
    username: user.username,
    todos: user.todos,
  });
};

const getTodos = (req, res) => {
  // return the todos for the current user
  const user = req.user;

  return res.send({
    _id: user._id,
    username: user.username,
    todos: user.todos,
  });
};

const markAsComplete = async (req, res) => {
  // mark a todo item as complete
  try {
    const user = req.user;

    const { todoListId, todoItemId } = req.body;

    let todoItemComplete = user.todos
      .find((item) => item.id === todoListId)
      .items.find((item) => item.id === todoItemId);

    todoItemComplete.completed = !todoItemComplete.completed;

    await user.save();

    return res.send({ success: true, val: todoItemComplete.completed });
  } catch (exception) {
    return res.send({ success: false });
  }
};

const deleteTodo = async (req, res) => {
  // delete a todo item
  try {
    const user = req.user;

    const { todoListId, todoItemId } = req.body;

    let todoItemToDelete = user.todos
      .find((item) => item.id === todoListId)
      .items.find((item) => item.id === todoItemId);

    if (todoItemToDelete) {
      user.todos
        .find((item) => item.id === todoListId)
        .items.splice(
          user.todos
            .find((item) => item.id === todoListId)
            .items.indexOf(todoItemToDelete),
          1
        );
    }

    await user.save();

    return res.send({ success: true, val: todoItemToDelete });
  } catch (exception) {
    return res.send({ success: false });
  }
};

const editTodo = async (req, res) => {
  // edit a todo item
  try {
    const user = req.user;

    const { todoListId, todoItemId, text } = req.body;

    let todoItem = user.todos
      .find((item) => item.id === todoListId)
      .items.find((item) => item.id === todoItemId);

    todoItem.text = text;

    await user.save();

    return res.send({ success: true, todoItem });
  } catch (exception) {
    return res.send({ success: false });
  }
};

// export all functions
module.exports = {
  createTodo,
  getTodos,
  markAsComplete,
  deleteTodo,
  editTodo,
};
