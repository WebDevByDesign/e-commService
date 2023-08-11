require('dotenv').config();

const express = require('express');
const routes = require('./routes');
const { Sequelize } = require('sequelize');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
const sequelize = new Sequelize(
  process.env.DB_NAME, // Your database name
  process.env.DB_USER, // Your database user
  process.env.DB_PASSWORD, // Your database password
  {
    host: process.env.DB_HOST, // Your database host
    dialect: 'mysql', // Choose the appropriate dialect for your database (e.g., mysql, postgres, sqlite, etc.)
  }
);

sequelize.sync({ force: false })
.then(() => {
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
})
.catch((error) => {
  console.error('Error syncing models', error);
});
