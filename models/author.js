var bcrypt = require("bcryptjs");
module.exports = function(sequelize, DataTypes) {
var Author = sequelize.define("Author", {
  author_name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:""
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
    },
    favourite: {
      type: DataTypes.STRING,
      allowNull: true
    },
    myrecipe: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Author.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Author.hasMany(models.Recipe, {
      onDelete: "cascade"
    });
  };

  // User.beforeCreate(user => {
  //   user.password = bcrypt.hashSync(
  //     user.password,
  //     bcrypt.genSaltSync(10),
  //     null
  //   );
  // });


  // Author.prototype.validPassword = function (password) {
  //   return bcrypt.compareSync(password, this.password);
  // };
  
  return Author;
};