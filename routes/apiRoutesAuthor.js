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
  var profileImgUpload = multer({
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
  }).single("profileImage");
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

  //Route for creating a recipe name
  app.post("/api/recipes/:id", function(req, res) {
    //upload image to S3 and retrieve URL to send to database.
    profileImgUpload(req, res, function(error) {
      // console.log( 'requestOkokok', req.file );
      // console.log( 'error', error );
      if (error) {
        console.log("errors", error);
        res.json({ error: error });
      } else {
        // If File not found
        if (req.file === undefined) {
          console.log("Error: No File Selected!");
          res.json("Error: No File Selected");
        } else {
          // If Success
          var imageName = req.file.key;
          var imageLocation = req.file.location;
          // Save the file name into database into profile model
          //============================================================================
          console.log(imageName);
          console.log(imageLocation);
          /*
          res.json({
            image: imageName,
            location: imageLocation
          });*/
          //==============================================================================

          console.log("Successfully executing route...");
          var recipeInput = {
            recipe_name: req.body.recipe_name,
            ingredients: req.body.ingredients,
            steps: req.body.steps,
            comments: req.body.comments,
            /*imgUrl: req.body.imgUrl,*/
            imgUrl: imageLocation,
            AuthorId: req.params.id
          };
          db.Recipe.create(recipeInput).then(function(dbRecipe) {
            res.json(dbRecipe);
          });
        }
      }
    });
  });

  //Route for creating ingredients for a specific recipe

  //Route for creating directions(steps) for a specific recipe

  //Route for getting all recipes
  app.get("/api/recipes", function(req, res) {
    // Otherwise send back the user's email and id
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.favorite
    db.Author.findAll().then(function(dbRecipes) {
      res.json(dbRecipes);
    });
  });

  //Route for getting info on a created recipe
  app.get("/api/recipes/:name", function(req, res) {
    // Otherwise send back the user's email and id
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.favorite
    db.Author.findOne({
      where: {
        recipe_name: req.params.name
      },
      include: [db.Favorite, db.Recipe, db.Ingredients, db.Steps]
    }).then(function(dbRecipe) {
      res.json(dbRecipe);
    });
  });

  //Route for getting favorite recipes

  //Route for getting favorite recipes and created recipes.
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

//=============================================================================================================
/*module.exports = function(app) {
  app.get("/api/authors", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Recipe
    db.Author.findAll({
      include: [db.Favorite, db.Recipe]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

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

  app.post("/api/authors", function(req, res) {
    //Adding new author entry to our author model
    db.Author.create(req.body).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  //Update author's personal info.
  app.put("/api/authors/:id", function(req, res) {
    console.log("Updating author's in");
    db.Author.update(req.body, {
      where: {
        id: req.params.id //should it be req.body.id??????
      }
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  // //Sign into the author's account
  // app.post("/api/signin", function(req, res) {
  //   console.log("Signing in by executing the correct route...");
  //   console.log(req.body);
  //   db.Author.findOne({
  //     where: {
  //       email: req.body.email,
  //       password: req.body.password
  //     }
  //   }).then(function(dbAuthor) {
  //     console.log(dbAuthor);
  //     res.json(dbAuthor);
  //   });
  // });

  //Sign into the author's account
  app.post("/api/signin", function(req, res) {
    console.log("Signing in by executing the correct route...");
    // console.log(req.body);
    db.Author.findOne({
      where: {
        email: req.body.email,
        password: req.body.password
      }
    }).then(function(dbAuthor) {
      // console.log(dbAuthor);
      // res.json(dbAuthor);
      if (dbAuthor === null) {
        res.send(false);
      } else {
        res.json(dbAuthor);
      }
    });
  });

  app.post("/api/signup", function(req, res) {
    console.log("signup");

    db.Author.create({
      email: req.body.email,
      password: req.body.password
    }).then(function(dbAuthor) {
      console.log(dbAuthor);
      // res.json(dbAuthor);
      if (dbAuthor === null) {
        res.send(false);
      } else {
        res.json(dbAuthor);
      }
    });
  });

  /*
  app.delete("/api/authors/:id", function(req, res) {
    db.Author.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });*/
//};
//=====================================================================================================
/*module.exports = function(app) {
  // Get all examples
  app.post("/api/signin", function(req, res) {
    console.log(req.body);
    db.Author.findOne({
      where: {
        email: req.body.email,
        password:req.body.password
      }
    })
      .then(function(dbAuthor) {
      
         console.log(dbAuthor);
        // res.json(dbAuthor);
        if (dbAuthor === null){
          return res.status(401).send(false);
        }else{
        res.send(true);
        }
      });
  });



  // Create a new example
  app.post("/api/signup", function(req, res) {
    console.log("signup");
  
    db.Author.create({
      email:req.body.email,
      password:req.body.password
    }).then(function(dbExample) {
      
      res.json(dbExample);
    });
  });

  app.post("/api/profile:id", function(req, res) {
    console.log(req.body);
    db.Author.findAll({
      where: {
        email: req.body.email,
        password:req.body.password
      }
    })
      .then(function(dbAuthor) {
      
         console.log(dbAuthor);
        // res.json(dbAuthor);
        if (dbAuthor === null){
          return res.status(401).send(false);
        }else{
        res.send(true);
        }
      });
  });


  app.post("/api/profile-page.js", function(req, res) {
    console.log(req.body);
    db.Author.findOne({
      where: {
        email: req.body.email,
        password:req.body.password
      }
    })
      .then(function(dbAuthor) {
      
         console.log(dbAuthor);
        // res.json(dbAuthor);
        if (dbAuthor === null){
          return res.status(401).send(false);
        }else{
        res.send(true);
        }
      });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};*/
