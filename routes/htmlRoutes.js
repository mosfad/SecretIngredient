//var db = require("../models");

/*
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

  app.get("/account-setting", function(req, res) {
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
*/
  


var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  }); 
  
  app.get("/author", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/author.html"));
  });

  // cms route loads cms.html
  app.get("/cms", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/cms.html"));
  });

  // blog route loads blog.html
  app.get("/account-settings", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/account-settings.html"));
  });

  // authors route loads author-manager.html
  app.get("/recipe-list", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/recipe-list.html"));
  });

  // authors route loads author-manager.html
  app.get("/profile-page", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/profile-page.html"));
  });
  // authors route loads author-manager.html
  /*
  app.get("/sign-in", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/sign-in.html"));
  });*/

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
}

