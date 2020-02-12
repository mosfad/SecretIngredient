module.exports = function(app) {
  // Requiring our custom middleware for checking if a user is logged in
  var isAuthenticated = require("../config/middleware/isAuthenticated");
  var path = require("path");
  //Routes...
  // Each of the below routes just handles the HTML page that the user gets sent to.

  //
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  //
  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/sign-up.html"));
  });

  app.get("/signin", function(req, res) {
    // If the user already has an account send them to the members page
    //console.log("I am in the signin html route...");
    if (req.user) {
      //console.log("Now redirecting...");
      return res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/sign-in.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/dashboard.html"));
  });

  //Send users with page with details of the selected recipes
  app.get("/recipeinfo", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/recipe-info.html"));
  });

  //All users(even unauthd) can search for recipes
  app.get("/searchAll", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/searchAll.html"));
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
