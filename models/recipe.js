module.exports = function(sequelize, DataTypes) {
  var Recipe = sequelize.define("Recipe", {
    recipe_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    steps: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prep_time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cook_time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    serving_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ratings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    /*owner: {
      type:
        DataTypes.STRING ...not sure of datatype to use. Boolean should work since we have author's ID!!!,
      allowNull: true
    },*/
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Recipe.associate = function(models) {
    // We're saying that a Recipe should belong to an Author
    // A Recipe can't be created without an Author due to the foreign key constraint
    Recipe.hasMany(models.Favorite, {
      foreignKey: {
        allowNull: false
      }
    });

    // Recipe.hasMany(models.Made, {
    //   foreignKey: {
    //     allowNull: false
    //   }
    // });

    // Recipe.hasMany(models.Ingredient, {
    //   foreignKey: {
    //     allowNull: true
    //   }
    // });

    // Recipe.hasMany(models.Step, {
    //   foreignKey: {
    //     allowNull: true
    //   }
    // });
  };

  return Recipe;
};
