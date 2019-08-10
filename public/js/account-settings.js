$(document).ready(function() {
    //references to personal elements.
    var authorName = $("#author");
    var authorEmail = $("#email");
    var authorPassword = $("#password");
    var numAuthorRecipes = $("#recipe-number");
    //references to buttons.
    var editPersonal = $(".update-personal");
    var editRecipes = $("#update-recipe");
    //how do I get the author name or id from signup???
    var authorId = 2;
    var numOfRecipes;
    
   
    // The API object contains methods for each kind of request we'll make
    var API = {
        getAuthor: function(recipe) {
          return $.ajax({
            headers: {
              "Content-Type": "application/json"
            },
            type: "GET",
            url: "/api/authors/" + authorId,
            data: JSON.stringify(recipe)
          });
        },
        getRecipes: function() {
          return $.ajax({
            url: "/api/recipes/" + authorId,
            type: "GET"
          });
        },
    };

    //populates the table with the author's total number of recipes with an API request.
   /* var countRecipes = function() {
        API.getRecipes().then(function(data) {
          console.log("Here is the data from the server: ");
          console.log(data);
          //numOfRecipes = data[0].Recipes.length;
          numAuthorRecipes = 11;
          numAuthorRecipes.text("You have " + numOfRecipes + " recipes!");
        
        });
    };*/

    //populates the table with the author's personal details with an API request.
     var showAuthorDetails = function() {
        API.getAuthor().then(function(data) {
          console.log("Here is the data from the server: ");
          console.log(data);
          var authorTable = data[0];
          //clear the table cells receiving the data from the API
          authorName.empty();
          authorEmail.empty();
          authorPassword.empty();
          //filling table cells with author's data from the API.
          authorName.text(authorTable.author_name);
          authorEmail.text(authorTable.email);
          authorPassword.text("************");
          //Get the author's number of recipes
          console.log(data[0].Recipes.length);
          numOfRecipes = authorTable.Recipes.length;
          numAuthorRecipes.text("You have " + numOfRecipes + " recipes!");

        });
    };
    //==========================================================================================================
    // handleFormSubmit is called whenever we add(submit) a new recipe
    // Save the new example to the db and refresh the list
    /*var handleFormSubmit = function(event) {       //FORM SUBMIT ISN'T BEING HANDLED!
        event.preventDefault();
        console.log("I was called....");
        var recipe = {
          recipe_name: recipeName.val().trim(),
          ingredients: recipeIngredients.val().trim(),
          steps: recipeSteps.val().trim(),
          comments: recipeComments.val().trim(),
          imgUrl: recipeImgUrl.val().trim(),
          AuthorId: authorId
        };
        console.log(recipe);
        API.addRecipes(recipe).then(function() {
            //show updated displays of favorite recipes and made recipes.
            showRecipes(favRecipesList);
            showRecipes(madeRecipesList);
            console.log("Recipe was successfully posted");
        });
        
        //clear the form after posting new recipe to the server.
        recipeName.val("");
        recipeIngredients.val("");
        recipeSteps.val("");
        recipeComments.val("");
        recipeImgUrl.val("");
    };*/

    var handleEditPersonal = function(event) {
        event.preventDefault();
        console.log("I am editing personal info")
        window.location.href = "/author";
    }

    var handleEditRecipes = function(event) {
        event.preventDefault();
        console.log("I am editing recipes");
        window.location.href = "/recipe-list";
    }
    

    //show author's personal details
    showAuthorDetails();
    //countRecipes();

    //add event listeners to the edit buttons
    editPersonal.on("click", handleEditPersonal);
    editRecipes.on("click", handleEditRecipes);

    //I AM HERE: Write the code to handle click events. *Think of how to pass author's id to the webpage you will be directed to.
});