const knex = require('knex')

const sqliteConnection = knex({
  client: "sqlite3",
  connection: {
    filename: "users.sqlite"
  }
});

module.exports = sqliteConnection;