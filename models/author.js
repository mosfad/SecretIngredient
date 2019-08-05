module.exports = function(sequelize, DataTypes) {
var Author = sequelize.define("Author", {
  author_name: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:""
  },
   email: {
      type: DataTypes.STRING,
      allowNull: false
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
  return Author;
};