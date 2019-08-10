var db = require("../models");

module.exports = function(app) {
  // Get all recipes
  app.get("/api/recipes", function(req, res) {
    db.Recipe.findAll({}).then(function(dbRecipe) {
      res.json(dbRecipe);
    });
  });

  // Get recipes for a specific authorId
  app.get("/api/recipes:id", function(req, res) {
    db.Recipe.findAll({
      where: {
        AuthorId: req.params.id
      }
    }).then(function(dbRecipe) {
      console.log("Getting recipes from the database....");
      console.log(dbRecipe);
      res.json(dbRecipe);
    });
  });

  // Create a new recipe for a specific authorId
  app.post("/api/recipes:id", function(req, res) {
    console.log("Post api was successfully called");
    //var authorId = req.params.id;
    console.log(req.body);
    db.Recipe.create({
      recipe_name:req.body.recipe_name,
      ingredients:req.body.ingredients,
      steps:req.body.steps,
      comments:req.body.comments,
      imgUrl:req.body.imgUrl,
      AuthorId: req.params.id
    }).then(function(dbRecipe) {
      console.log("Post was successfully made");
      res.json(dbRecipe);
    });
  });
/*
  app.post("/api/recipe:id", function(req, res) {

  })*/

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};




