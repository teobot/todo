// Require config
const config = require("../config/config");

// require auth
const auth = require("../middlewares/requireAuth");

// Import JWT
var jwt = require("jsonwebtoken");

// Check if dates are on the same day
const { datesAreOnSameDay } = require("../functions/general.functions");

const deleteList = async (req, res) => {
  try {
    const user = req.user;

    const { listId } = req.body;

    //if listid doesnt exist
    if (!listId) {
      return res.status(400).send({
        success: false,
        message: "List id is required",
      });
    }

    let listToDelete = user.todos.find((item) => item.id === listId);

    if (listToDelete) {
      user.todos.splice(user.todos.indexOf(listToDelete), 1);
    }

    await user.save();

    return res.send({ success: true, data: user });
  } catch (error) {
    return res.send({ success: false });
  }
};

const createList = async (req, res) => {
  // this method creates a new list
  const user = req.user;

  const { listTitle } = req.body;

  if (!listTitle) {
    return res.status(400).send({
      success: false,
      message: "Please provide a list title",
    });
  }

  try {
    user.todos.push({ title: listTitle, date: new Date(), items: [] });

    await user.save();

    return res.send({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
    });
  }
};

const createTodo = async (req, res) => {
  const user = req.user;

  const { todoText, listId } = req.body;

  let newDate = new Date();

  if (!todoText) {
    return res.status(400).send({
      success: false,
      message: "Please provide a todo text",
    });
  }

  if (!listId) {
    return res.status(400).send({
      success: false,
      message: "Please provide a list id",
    });
  }

  if (listId) {
    // : if the listId is a variable the user wants to add a todo to a list

    let todoList = user.todos.find((item) => item.id === listId);

    if (todoList) {
      todoList.items.push({
        id: new Date().getTime(),
        text: todoText,
        date: newDate,
        completed: false,
      });
    }

    await user.save();

    return res.send({ success: true, data: user });
  } else {
    return res.status(400).send({ success: false });
  }
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

    return res.send({ success: true, data: user });
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

    return res.send({ success: true, data: user });
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

    return res.send({ success: true, data: user });
  } catch (exception) {
    return res.send({ success: false });
  }
};

// export all functions
module.exports = {
  createTodo,
  createList,
  getTodos,
  markAsComplete,
  deleteTodo,
  editTodo,
  deleteList,
};
