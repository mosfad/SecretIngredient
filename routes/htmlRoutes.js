var db = require("../models");

module.exports = function(app) {
  app.get("/", function(req,res){
    res.render("index");
  })
  // Load index page
  // app.get("/", function(req, res) {
  //   db.Author.findAll({}).then(function(dbExamples) {
  //     res.render("index", {
  //       msg: "Welcome!",
  //       examples: dbExamples
  //     });
  //   });
  // });

  // Load example page and pass in an example by id
  app.get("/signin", function(req, res) {
    // db.Author.findOne({ where: { email: req.body.email,
    //   password: req.body.email}}).then(function(dbAuthor) {
    //   res.render("recipe", {
    //     author: dbAuthor
    //   });
    // });
    res.render("recipe");
  });

  app.get("/profile-page", function(req, res) {
    // db.Author.findOne({ where: { email: req.body.email,
    //   password: req.body.email}}).then(function(dbAuthor) {
    //   res.render("recipe", {
    //     author: dbAuthor
    //   });
    // });
    res.render("recipe");
  });



  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
