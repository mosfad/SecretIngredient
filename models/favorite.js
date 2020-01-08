module.exports = function(sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorite", {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    favUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ""
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
    Favorite.belongsTo(models.Recipe, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Favorite;
};
