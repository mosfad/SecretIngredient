// module.exports = function(sequelize, DataTypes) {
//   var Step = sequelize.define("Step", {
//   direction: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   }
// });

//   Step.associate = function(models) {
//     // We're saying that a Step should belong to an Author
//     // A Step can't be created without an Author due to the foreign key constraint
//     Step.belongsTo(models.Recipe, {
//       foreignKey: {
//         allowNull: false
//       }
//     });
//   };

//   return Step;
// };
