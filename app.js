var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
const knex = require('./knex/knex')

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', indexRouter);

/* POST create user */
app.post('/users', async (req, res) => {
  const user = await createUser(req.body)
  res.status(201).json({ user: user });
});

/* GET all users. */
app.get('/users', async (req, res) => {
  const users = await getAllUsers()
  console.log(users)
  res.status(200).json({ users });
});

/* GET a user. */
app.get('/users/:id', async (req, res) => {
  const user = await getUser(req.params.id)
  res.status(200).json({ user: user });
});

/* PUT update user */
app.put('/users/:id', async (req, res) => {
  const user = await updateUser(req.params.id, req.body)
  res.status(202).json({ user: user });
});

/* DELETE user */
app.delete('/users/:id', async (req, res) => {
  await deleteUser(req.params.id)
  res.status(204).json({ msg: "user with id(" + req.params.id + ") deleted successfully."  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function createUser(user) {
  return knex("users").insert(user)
}

function getAllUsers() {
  return knex("users").select("id", "first_name", "last_name", "age");
}

function getUser(id) {
  return knex("users").where("id", id).select("id", "first_name", "last_name", "age")
}

function updateUser(id, user) {
  return knex("users").where("id", id).update(user)
}

function deleteUser(id) {
  return knex("users").where("id", id).del()
}

module.exports = app;
