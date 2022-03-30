const { connect, connection } = require('mongoose');

connect('mongodb://localhost/usersDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;