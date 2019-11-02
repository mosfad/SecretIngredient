module.exports = function(sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorite", {
    recipe_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Favorite.associate = function(models) {
    // We're saying that a Favorite should belong to an Author
    // A Favorite can't be created without an Author due to the foreign key constraint
    Favorite.belongsTo(models.Author, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Favorite;
};
