/*$(document).ready(function(){
  $('.parallax').parallax();
});
*/
$(document).ready(function() {
    $('.parallax').parallax();
    //references to elements on profile page
    var favRecipesList = $("#favorite-recipes-names");
    var madeRecipesList = $("#created-recipes-names");
    var buttonSubmitRecipe = $("#submit-recipe");
    var recipeName = $("#recipe-name");
    var recipeIngridents = $("#recipe-ingridents");
    var recipeSteps = $("#recipe-steps");
    // The API object contains methods for each kind of request we'll make
    var API = {
        addRecipes: function(recipe) {
          return $.ajax({
            headers: {
              "Content-Type": "application/json"
            },
            type: "POST",
            url: "api/author",
            data: JSON.stringify(recipe)
          });
        },
        getRecipes: function() {
          return $.ajax({
            url: "api/author",
            type: "GET"
          });
        },
    };

    //populates the recipe cards based on the parameter `column name` i.e made recipes or favorite recipes.
    var showRecipes = function(columnName, cardList) {
        API.getRecipes().then(function(data) {
          var recipes = data.map(function(recipe) {
            var a = $("<a>")
              .text(recipe.columnName)
              .attr("href", "/recipe/" + recipe.id);
      
            var li = $("<li>")
              .attr({
                class: "list-group-item",
                "data-id": recipe.id
              })
              .append(a);
      
            return li;
          });
      
          cardList.empty();
          cardList.append(recipes);
        });
    };

    //display the favorite recipes
    showRecipes(favorite, favRecipesList);
    //display the made recipes
    showRecipes(made, madeRecipesList); //Is "made" one of the  column names for the author or recipe tables?


    // handleFormSubmit is called whenever we add(submit) a new recipe
    // Save the new example to the db and refresh the list
    var handleFormSubmit = function(event) {
        event.preventDefault();
      
        var recipe = {
          name: recipeName.val().trim(),
          ingridents: recipeIngridents.val().trim(),
          steps: recipeSteps.val().trim()
        };
      
        /*if (!(example.text && example.description)) {
          alert("You must enter an example text and description!");
          return;
        }*/
      
        API.addRecipes(recipe).then(function() {
            //show updated displays of favorite recipes and made recipes.
            showRecipes(favorite, favRecipesList);
            showRecipes(made, madeRecipesList);
        });
        
        //clear the form after posting new recipe to the server.
        recipeName.val("");
        recipeIngridents.val("");
        recipeSteps.val("");
    };

    // Add event listener to the submit button
    buttonSubmitRecipe.on("click", handleFormSubmit);
    
});
