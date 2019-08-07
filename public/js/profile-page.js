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
    var recipeComments = $("#recipe-comments");
    var recipeImgUrl = $("#recipe-img-url");
    //references to icons and buttons that trigger events
    var buttonSubmitRecipe = $("#submit-recipe");
    var iRevealMadeRecipe = $("#reveal-made-recipes");
    var iRevealFavRecipe = $("#reveal-fav-recipes");

    authorId = 2;
    // The API object contains methods for each kind of request we'll make
    var API = {
        addRecipes: function(recipe) {
          return $.ajax({
            headers: {
              "Content-Type": "application/json"
            },
            type: "POST",
            url: "/api/recipes" + authorId,
            data: JSON.stringify(recipe)
          });
        },
        getRecipes: function() {
          return $.ajax({
            url: "/api/authors/" + authorId,
            type: "GET"
          });
        },
    };

    //populates the recipe cards based on the parameter `column name` i.e made recipes or favorite recipes.
    var showRecipes = function(cardList) {
        API.getRecipes().then(function(data) {
          console.log("Here is the data from the server: ");
          console.log(data);
          var recipes = data.map(function(recipe) {
            console.log("Trying to figure out what data.map does; recipe = ");
            console.log(recipe);
            if (cardList === madeRecipesList) {
              var i = $("<i>")
                .text("cake")
                .attr({
                  class: "material-icons"
                })
              var li = $("<li>")                   
                .text(" " + recipe.myrecipe)   
                .attr({
                  class: "collection-item"
                })
                .prepend(i)
                return li;
            }
            else {
              var i = $("<i>")
                .text("favorite")
                .attr({
                  class: "material-icons"
                })

              var li = $("<li>")                    
                .text(" " + recipe.favourite)   
                .attr({
                  class: "collection-item"
                })
                .prepend(i)
                return li;
            } 
          }); 
          console.log("Extracting favorite recipe from data: ");
          console.log(recipes);
          cardList.empty();// I AM RIGHT HERE !
          cardList.append(recipes);// I AM RIGHT HERE !
        });
    };

    // handleFormSubmit is called whenever we add(submit) a new recipe
    // Save the new example to the db and refresh the list
    var handleFormSubmit = function(event) {       //FORM SUBMIT ISN'T BEING HANDLED!
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
    iRevealMadeRecipe.on("click", showRecipes(madeRecipesList));

    //MAKE SURE THAT THE DATABASE HAS COLUMN NAMES `favorite` and `made`......
    //WORK ON THE ELEMENTS FOR THE LISTS favorite and made. DONE
    //WORK ON THE SUMBIT FORM AND ITS ELEMENTS. DONE
});
