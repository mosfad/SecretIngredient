require('dotenv').config();
module.exports = {
  "development": {
    "username": "root",
    "password": "aurora726",
    "database": "recipe_db",
    "host": "localhost",
    "port": 3306,
    "dialect": "mysql",
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql",
  
  },
  "production": {
    "use_env_variable": "JAWSDB_URL",
    "dialect": "mysql"
  }
}