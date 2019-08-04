var db = require("../models");

module.exports = function(app) {
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

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
