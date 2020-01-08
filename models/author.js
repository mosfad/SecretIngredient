var bcrypt = require("bcryptjs");
module.exports = function(sequelize, DataTypes) {
  var Author = sequelize.define("Author", {
    author_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Author.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Author.hasMany(models.Favorite, {
      onDelete: "cascade"
    });

    Author.hasMany(models.Recipe, {
      onDelete: "cascade"
    });
  };

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  Author.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  Author.hook("beforeCreate", function(author) {
    author.password = bcrypt.hashSync(
      author.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  // Author.beforeCreate(autor => {
  //   autor.password = bcrypt.hashSync(
  //     autor.password,
  //     bcrypt.genSaltSync(10),
  //     null
  //   );
  // });

  // Author.prototype.validPassword = function(password) {
  //   return bcrypt.compareSync(password, this.password);
  // };

  return Author;
};
