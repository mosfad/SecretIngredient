require("dotenv").config();
var db = require("../models");
var passport = require("../config/passport");

// route/api/profile.js
var express = require("express");
var aws = require("aws-sdk");
var multerS3 = require("multer-s3");
var multer = require("multer");
var path = require("path");
var url = require("url");

aws.config.region = "us-east-2";

module.exports = function(app) {
  /* PROFILE IMAGE STORING STARTS
   */
  const s3 = new aws.S3({
    accessKeyId: process.env.ID_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    Bucket: process.env.BUCKET_NAME
  });
  /**
   * Single Upload
   */
  var recipeImgUpload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET_NAME,
      acl: "public-read",
      key: function(req, file, cb) {
        cb(
          null,
          path.basename(file.originalname, path.extname(file.originalname)) +
            "-" +
            Date.now() +
            path.extname(file.originalname)
        );
      }
    }),
    limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function(req, file, cb) {
      checkFileType(file, cb);
    }
  }).single("recipeImg");
  /**
   * Check File Type
   * @param file
   * @param cb
   * @return {*}
   */
  function checkFileType(file, cb) {
    // Allowed ext
    var filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    var mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  }
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/signin", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize Author Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    //console.log(req.body);
    db.Author.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/signin");
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });
  });

  // Route for logging user out; Passport exposes logout() on req. DONE!
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/author_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  //Route for creating a recipe
  app.post("/api/recipes/:id", function(req, res) {
    //upload image to S3 and retrieve URL to send to database.
    recipeImgUpload(req, res, function(error) {
      // console.log( 'requestOkokok', req.file );
      // console.log( 'error', error );
      if (error) {
        console.log("errors", error);
        res.json({ error: error });
      } else {
        // If File not found
        if (req.file === undefined) {
          console.log("Error: No File Selected!");
          console.log(req);
          res.json("Error: No File Selected");
        } else {
          // If Success
          var imageName = req.file.key;
          var imageLocation = req.file.location;
          // Save the file name into database into profile model
          //============================================================================
          console.log(imageName);
          console.log(imageLocation);
          console.log(req.body);
          console.log(req.params.id);
          /*
          res.json({
            image: imageName,
            location: imageLocation
          });*/
          //==============================================================================

          console.log("Successfully executing route...");
          var recipeInput = {
            recipe_name: req.body.recipeName,
            ingredients: req.body.recipeIngredients,
            steps: req.body.recipeSteps,
            description: req.body.recipeDescription,
            prep_time: req.body.prepTime,
            cook_time: req.body.cookTime,
            serving_size: req.body.servingSize,

            /*imgUrl: req.body.imgUrl,*/
            imgUrl: imageLocation,
            AuthorId: req.params.id
          };
          db.Recipe.create(recipeInput)
            .then(function(dbRecipe) {
              res.json(dbRecipe);
            })
            .catch(function(err) {
              console.log(err);
              res.json(err);
            });
        }
      }
    });
  });

  //Route for adding(bookmarking) a recipe
  app.post("/api/favrecipes/:userid/:recipeid", function(req, res) {
    console.log("I am inside the appropriate route!");
    var favrecipeInput = {
      name: req.body.name,
      userId: req.params.userid,
      // ratings: req.body.ratings,
      // comments: req.body.comments,
      AuthorId: req.body.AuthorId,
      RecipeId: req.params.recipeid
    };
    db.Favorite.create(favrecipeInput)
      .then(function(dbFavorite) {
        res.json(dbFavorite);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  });

  //Route for getting all recipes
  app.get("/api/allrecipes", function(req, res) {
    // Otherwise send back the user's email and id
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.favorite
    console.log("I am inside the route to get all the recipes!");
    db.Recipe.findAll().then(function(dbRecipes) {
      res.json(dbRecipes);
    });
  });

  //Route for getting recipes created by the user.
  app.get("/api/recipes/:id", function(req, res) {
    // Otherwise send back the user's email and id
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.favorite
    db.Recipe.findAll({
      where: {
        AuthorId: req.params.id
      }
    }).then(function(dbRecipes) {
      res.json(dbRecipes);
    });
  });

  //Route for getting info on a created recipe
  app.get("/api/recipeinfo/:name", function(req, res) {
    // Otherwise send back the user's email and id
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.favorite
    console.log("This route was requested by " + req.params.name + " recipe");
    //I AM GETTING ERRORS HERE: Unhandled rejection TypeError: Cannot read property '_pseudo' of undefined
    db.Recipe.findOne({
      where: {
        recipe_name: req.params.name
      }
      /*include: [db.Favorite, db.Recipe]*/
    }).then(function(dbRecipe) {
      res.json(dbRecipe);
    });
  });

  //Route for getting favorite recipes for a specific user
  app.get("/api/favrecipes/:userid", function(req, res) {
    db.Favorite.findAll({
      where: {
        userId: req.params.userid
      },
      include: [db.Author, db.Recipe]
    }).then(function(dbFavorites) {
      console.log(dbFavorites);
      res.json(dbFavorites);
    });
  });

  //Route for getting info on favorite recipe
  app.get("api/favrecipeinfo/:name", function(req, res) {
    console.log("This route was requested by " + req.params.name + " recipe");
    //I AM GETTING ERRORS HERE: Unhandled rejection TypeError: Cannot read property '_pseudo' of undefined
    db.Favorite.findOne({
      where: {
        name: req.params.name
      },
      include: [db.Recipe]
    }).then(function(dbFavorite) {
      res.json(dbFavorite);
    });
  });

  //Route for getting favorite recipes and created recipes for a specific user
  app.get("/api/authors/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.favorite
    db.Author.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Favorite, db.Recipe]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });
};

// // Route for getting some recipe info about our user to use on client side.
// app.get("/api/author/:id", function(req, res) {
//   // Here we add an "include" property to our options in our findOne query
//   // We set the value to an array of the models we want to include in a left outer join
//   // In this case, just db.favorite
//   db.Author.findOne({
//     where: {
//       id: req.params.id
//     },
//     include: [db.Favorite, db.Recipe]
//   }).then(function(dbAuthor) {
//     res.json(dbAuthor);
//   });
// });

// Route for deleting user account.
