/*$(document).ready(function(){
  $('.parallax').parallax();
});
*/
$(document).ready(function() {
    $('.parallax').parallax();
    //references to unordered lists that will display recipes.
    var favRecipesList = $("#favorite-recipes");
    var madeRecipesList = $("#made-recipes");
   //references to form elements
    var recipeName = $("#recipe-name");
    var recipeIngredients = $("#recipe-ingredients");
    var recipeSteps = $("#recipe-steps");
    //references to icons and buttons that trigger events
    var buttonSubmitRecipe = $("#submit-recipe");
    var iRevealMadeRecipe = $("#reveal-made-recipes");
    var iRevealFavRecipe = $("#reveal-fav-recipes");

    
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
            if (cardList == madeRecipesList) {
              var i = $("<i>")
                .text("cake")
                .attr({
                  class: "material-icons"
                })
            }
            else {
              var i = $("<i>")
                .text("favorite")
                .attr({
                  class: "material-icons"
                })
            }
            var li = $("<li>")
              .text(recipe.columnName)
              attr({
                class: "collection-item"
              })
              .append(i)
              return li;
            });
      
          cardList.empty();// I AM RIGHT HERE !
          cardList.append(recipes);// I AM RIGHT HERE !
        });
    };

    // handleFormSubmit is called whenever we add(submit) a new recipe
    // Save the new example to the db and refresh the list
    var handleFormSubmit = function(event) {
        event.preventDefault();
      
        var recipe = {
          name: recipeName.val().trim(),
          ingredients: recipeIngredients.val().trim(),
          steps: recipeSteps.val().trim()
        };
        API.addRecipes(recipe).then(function() {
            //show updated displays of favorite recipes and made recipes.
            showRecipes(favorite, favRecipesList);
            showRecipes(made, madeRecipesList);
        });
        
        //clear the form after posting new recipe to the server.
        recipeName.val("");
        recipeIngredients.val("");
        recipeSteps.val("");
    };

    // Add event listener to the submit button
    buttonSubmitRecipe.on("click", handleFormSubmit);
    //Add event listener for icons to reveal recipes
    iRevealFavRecipe.on("click", showRecipes(favorite, favRecipeList));
    iRevealMadeRecipe.on("click", showRecipes(made, madeRecipesList));

    //MAKE SURE THAT THE DATABASE HAS COLUMN NAMES `favorite` and `made`......
    //WORK ON THE ELEMENTS FOR THE LISTS favorite and made. DONE
    //WORK ON THE SUMBIT FORM AND ITS ELEMENTS. DONE
});
