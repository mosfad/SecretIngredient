// module.exports = function(sequelize, DataTypes) {
//   var Ingredient = sequelize.define("Ingredient", {
//     ingredient_name: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     imgUrl: {
//       type: DataTypes.STRING,
//       allowNull: true
//     }
//   });

//   Ingredient.associate = function(models) {
//     // We're saying that a Recipe should belong to an Author
//     // A Recipe can't be created without an Author due to the foreign key constraint
//     //???DO I NEED `belongsTo` HERE*******
//     Ingredient.belongsTo(models.Recipe, {
//       foreignKey: {
//         allowNull: false
//       }
//     });
//   };

//   return Ingredient;
// };
