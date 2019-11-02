var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
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
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
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

  // Route for logging user out
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
};

// Route for getting some recipe info about our user to use on client side.
app.get("/api/author/:id", function(req, res) {
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
