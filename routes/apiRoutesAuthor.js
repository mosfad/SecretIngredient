var db = require("../models");

module.exports = function(app) {
  app.get("/api/authors", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Recipe
    db.Author.findAll({
      include: [db.Recipe]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  app.get("/api/authors/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Recipe
    db.Author.findAll({
      where: {
        id: req.params.id
      },
      include: [db.Recipe]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  app.post("/api/authors", function(req, res) {
    db.Author.create(req.body).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  //Update author's personal info.
  app.put("/api/authors/:id", function(req, res) {
    console.log("API WAS CALLED TO UPDATE AUTHOR'S INFO!");
    db.Author.update(
      req.body,
      {
      where: {
        id: req.params.id   //should it be req.body.id??????
      }
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  })

  //Sign into the author's account
  app.post("/api/signin", function(req, res) {
    console.log("Signing in by executing the correct route.....");
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

};
























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
