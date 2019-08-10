$(document).ready(function() {
    //references to unordered list that will display all user's recipes.
    var allRecipesList = $("#all-recipes");
    //
    /*
    var favRecipesList = $("#favorite-recipes");
    var madeRecipesList = $("#made-recipes");
   //references to form elements
    var recipeName = $("#recipe-name");
    var recipeIngredients = $("#recipe-ingredients");
    var recipeSteps = $("#recipe-steps");
    var recipeComments = $("#recipe-comments");
    var recipeImgUrl = $("#recipe-img-url");
    //references to icons and buttons that trigger events
    var buttonSubmitRecipe = $("#submit-recipe");
    var iRevealMadeRecipe = $("#reveal-made-recipes");
    var iRevealFavRecipe = $("#reveal-fav-recipes");*/

    authorId = 2;
    // The API object contains methods for each kind of request we'll make
    var API = {
        addRecipes: function(recipe) {
          return $.ajax({
            headers: {
              "Content-Type": "application/json"
            },
            type: "PUT",
            url: "/api/recipes" + authorId,
            data: JSON.stringify(recipe)
          });
        },
        getRecipes: function() {
          return $.ajax({
            url: "/api/recipes" + authorId,
            type: "GET"
          });
        },
    };

    //populates the recipe cards based on the parameter `column name` i.e made recipes or favorite recipes.
    var showRecipes = function(recipeList) {
        API.getRecipes().then(function(data) {
          console.log("Here is the data from the server: ");
          console.log(data);
          var recipes = data.map(function(recipe) {
            console.log("Trying to figure out what data.map does; recipe = ");
            console.log(recipe);

            var iButton = $("<i>")
                .text("Send")
                .attr({
                    class: "material-icons right"
                })
            
            var editButton = $("<button>")
                .text("Edit")
                .attr({
                    class: "btn waves-effect waves-light blue right edit-recipe",
                    type: "submit",
                    name: "action"

                })
            
            var i = $("<i>")
                .text("label")
                .attr({
                  class: "material-icons"
                })
            var li = $("<li>")                   
                .text("    " + recipe.recipe_name)   
                .attr({
                  class: "collection-item"
                })
                .prepend(i)
                .append(editButton)
                return li;
            })
          
          console.log("Extracting favorite recipe from data: ");
          console.log(recipes);
          //editButton.append(iButton);

          recipeList.empty();// I AM RIGHT HERE !
          recipeList.append(recipes);// I AM RIGHT HERE !
        });
    };

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
    };

    // Add event listener to the submit button
    buttonSubmitRecipe.on("click", handleFormSubmit);
    //Add event listener for icons to reveal recipes
    iRevealFavRecipe.on("click", showRecipes(favRecipesList));
    iRevealMadeRecipe.on("click", showRecipes(madeRecipesList)); */

    var handleFormSubmit = function(event) {       //FORM SUBMIT ISN'T BEING HANDLED!
        event.preventDefault();
        console.log("I was called....");
        //HOW DO I ADD RECIPE ID TO CMS???????
        //REDIRECTING ISN'T WORKING!!!
        window.location.href = "/cms"
    };
    //show all the recipes the user can choose to update
    showRecipes(allRecipesList);
    //HANDLE BUTTON EVENTS FOR ONES CREATED DYNAMICALLY***************
    allRecipesList.on("click", ".edit-recipe", handleFormSubmit);

});