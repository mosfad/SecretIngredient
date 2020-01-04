$(document).ready(function() {
  $(".modal").modal();
  $(".sidenav").sidenav();
  //references to unordered lists that will display recipes.
  // var favRecipesList = $("#favorite-recipes");
  // var madeRecipesList = $("#made-recipes");
  //references to form elements
  // var recipeName = $("#recipeName");
  // var recipeIngredients = $("#recipeIngredients");
  // var recipeSteps = $("#recipeSteps");
  // var recipeComments = $("#recipeComments");
  // var recipeImgUrl = $("#recipeImg");
  //references to elements and buttons that trigger events
  var btnAddRecipe = $("#submit-recipe");
  var recipeCard = $("#recipe-container");
  var favoriteCard = $("#favorite-container");
  /*
  userId = id of the user that bookmarks a recipe
  authorId = id of the user that creates a recipe.
 */
  var authorId;
  var userId;
  var recipeId;

  $.ajax({
    type: "GET",
    url: "/api/author_data"
  })
    .done(function(authorData) {
      console.log(authorData);
      authorId = authorData.id;
      userId = authorData.id;
      console.log(authorId);
      console.log("Displaying my recipes....");
      displayMyRecipes();
      displayFavRecipes();
    })
    .fail(function(jqXHR, textStatus, errThrown) {
      console.log(textStatus + ": " + errThrown);
    });

  var API = {
    addMyRecipe: function(recipe) {
      return $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: "/api/recipes/" + authorId,
        data: recipe,
        processData: false,
        contentType: false,
        cache: false,
        /*timeout: 600000,*/
        success: function(data) {
          alert("Recipe successfully added!");
          console.log("SUCCESS : ", data);
        },
        error: function(e) {
          alert("Recipe was not added! Please try again.");
          console.log("ERROR : ", e);
        }
      });
    },
    getMyRecipes: function() {
      return $.ajax({
        type: "GET",
        url: "/api/recipes/" + authorId
      });
    },
    addFavRecipe: function(recipe) {
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: "/api/recipes/" + userId + "/" + recipeId,
        data: JSON.stringify(recipe)
      });
    },
    getFavRecipes: function() {
      return $.ajax({
        url: "/api/favrecipes/" + userId,
        type: "GET"
      });
    },
    deleteFavRecipe: function(recipeId) {
      return $.ajax({
        url: "/api/delete/favrecipe/" + userId + "/" + recipeId,
        type: "DELETE"
      });
    }
  };

  var displayMyRecipes = function() {
    console.log("I am inside the function");
    API.getMyRecipes().then(function(data) {
      console.log("I am inside the API to get my recipes...");
      console.log(data);
      data.map(function(recipe, index) {
        console.log(recipe);
        console.log(index);
        var col = $("<div>").attr("class", "col s12 m3");
        //Give each card unique row and col to appropriately append subsequent card.
        //var numOfRow = Math.floor(index / 4);
        var numOfCol = index % 4;
        col.attr("id", "col-entry" + index);
        if (numOfCol === 0) {
          //Create and add new row to the DOM to hold next four recipes
          var row = $("<div>").attr("class", "row");
          $("#recipe-container").append(row);
          row.append(col);
        } else {
          //Add recipe to current row, which an open slot to hold current recipe.
          $("#recipe-container .row:last-child").append(col);
        }

        var card = $("<div>")
          .attr("class", "card")
          .appendTo(col);
        var cardImage = $("<div>")
          .attr("class", "card-image")
          .append($("<img>").attr("src", recipe.imgUrl))
          .appendTo(card);
        var cardContent = $("<div>")
          .attr("class", "card-content")
          .appendTo(card);
        // var recipeTitle = $("<a>")
        //   .attr("class", "recipeTitle")
        //   .text(recipe.recipe_name)
        //   .appendTo(cardContent);
        var recipeTitle = $("<a>")
          .attr("href", "/recipeinfo")
          .addClass("recipeTitle")
          .text(recipe.recipe_name)
          .appendTo(cardContent);
        var comments = $("<p>")
          .append($("<span>").attr("class", "comments"))
          .text("-" + recipe.description)
          /*.append($("<strong>").text(recipe.comments))*/
          .append($("<br>"))
          .appendTo(cardContent);
        //how to use ratings number to set the ratings star
        //var numRatings = 0;
        var numRatings = parseInt(recipe.ratings);
        //need to append each of the star spans to <p> after <br>
        for (var i = 0; i < 5; i++) {
          var starSpan = $("<span>");
          if (numRatings > 0) {
            starSpan.attr("class", "checked");
          }
          starSpan
            .append(
              $("<i>")
                .attr("class", "material-icons")
                .text("star")
            )
            .appendTo(comments);
          numRatings--;
        }
      });
    });
  };

  var displayFavRecipes = function() {
    console.log("I am inside the function");
    API.getFavRecipes().then(function(data) {
      console.log("I am inside the API to get my favorite recipes...");
      console.log(data);
      if (Array.isArray(data) && data.length) {
        //if array is not empty then remove favorite card placeholder.
        $("#favorite-recipe-placeholder").remove();
      } else {
        return;
      }
      data.map(function(favorite, index) {
        console.log(favorite);
        console.log(index);
        var col = $("<div>").attr("class", "col s12 m3");
        //Give each card unique row and col to appropriately append subsequent card.
        //var numOfRow = Math.floor(index / 4);
        var numOfCol = index % 4;
        col.attr("id", "col-entry" + index);
        if (numOfCol === 0) {
          //Create and add new row to the DOM to hold next four favorite
          var row = $("<div>").attr("class", "row");
          $("#favorite-container").append(row);
          row.append(col);
        } else {
          //Add favorite to current row, which an open slot to hold current favorite.
          $("#favorite-container .row:last-child").append(col);
        }

        var card = $("<div>")
          .attr("class", "card")
          .appendTo(col);
        var cardImage = $("<div>")
          .attr("class", "card-image")
          .append($("<img>").attr("src", favorite.Recipe.imgUrl))
          .appendTo(card);
        var cardContent = $("<div>")
          .attr("class", "card-content")
          .appendTo(card);
        // var favoriteTitle = $("<p>")
        //   .attr("class", "favoriteTitle")
        //   .text(favorite.recipe_name)
        //   .appendTo(cardContent);
        var favoriteTitle = $("<a>")
          .attr("href", "/recipeinfo")
          .addClass("favoriteTitle")
          .text(favorite.Recipe.recipe_name)
          .appendTo(cardContent);
        var description = $("<p>")
          .append($("<span>").attr("class", "description"))
          .text("-" + favorite.Recipe.description)
          /*.append($("<strong>").text(recipe.comments))*/
          .append($("<br>"))
          .appendTo(cardContent);
        //how to use ratings number to set the ratings star
        //var numRatings = 0;
        var numRatings = parseInt(favorite.ratings);
        //need to append each of the star spans to <p> after <br>
        for (var i = 0; i < 5; i++) {
          var starSpan = $("<span>");
          if (numRatings > 0) {
            starSpan.attr("class", "checked");
          }
          starSpan
            .append(
              $("<i>")
                .attr("class", "material-icons")
                .text("star")
            )
            .appendTo(description);
          numRatings--;
        }
        var deletebtn = $("<span>")
          .attr("class", "remove-favcard")
          .append(
            $("<a>")
              // error is using favorite.id instead of favorite.RecipeId
              .addClass("waves-effect waves-light btn-floating red")
              .attr({
                id: "delete-" + favorite.id,
                "data-favrecipeid": favorite.RecipeId
              })
              .append(
                $("<i>")
                  .addClass("material-icons")
                  .text("clear")
              )
          );

        deletebtn.appendTo(description);
      });
    });
  };

  var handleRecipeRequest = function(event) {
    //Prevent default behavior of submitting form.
    console.log("I am inside the recipe request handler...");
    event.preventDefault();
    var recipeName = $(this).text();
    if (localStorage.getItem("recipeChosen")) {
      localStorage.clear();
    }
    localStorage.setItem("recipeChosen", recipeName);

    //console.log("Selected Recipe is: " + recipeName);
    //displayRecipeInfo(recipeName);
    location.href = "/recipeinfo";
  };

  var handleFavoriteRequest = function(event) {
    //Prevent default behavior of submitting form.
    console.log("I am inside the recipe request handler...");
    event.preventDefault();
    var favoriteName = $(this).text();
    if (localStorage.getItem("recipeChosen")) {
      localStorage.clear();
    }
    localStorage.setItem("recipeChosen", favoriteName);

    console.log("Selected Recipe is: " + favoriteName);
    location.href = "/recipeinfo";
  };

  var handleDeleteRequest = function(event) {
    //Prevent default behavior of submitting form.
    console.log("Handler is deleting favorite recipe...");
    event.preventDefault();
    var deletebtnEle = $(this);
    console.log(deletebtnEle.attr("data-favrecipeidd"));
    API.deleteFavRecipe(deletebtnEle.attr("data-favrecipeid")).then(function(
      dbFavorite
    ) {
      //find how to replace `Recipe` with actual `Recipe Name`.
      alert("Recipe has been successfully removed from bookmarks.");
      location.reload();
    });
  };

  //
  var handleFormSubmit = function(event) {
    event.preventDefault();
    console.log("The modal enters the form correctly!!!");
    var recipeFormData = new FormData($("#new-recipe-form")[0]);
    console.log(recipeFormData);
    for (var pair of recipeFormData.entries()) {
      console.log(pair[0]);
      console.log(pair[1]);
    }
    // API.addMyRecipe(recipeFormData).done(function(response) {
    //   console.log(response);
    // });
    API.addMyRecipe(recipeFormData);
    // var postIngredient = postRecipe.then(function(data) {
    //   API.addFavRecipe;
    // });
  };
  //Add event listener to submit button
  //   $("#modal1").on("click", buttonSubmitRecipe, handleFormSubmit);
  btnAddRecipe.on("click", handleFormSubmit);
  recipeCard.on("click", ".recipeTitle", handleRecipeRequest);
  favoriteCard.on("click", ".favoriteTitle", handleFavoriteRequest);
  favoriteCard.on("click", ".remove-favcard > a", handleDeleteRequest);
  //MAKE SURE THAT THE DATABASE HAS COLUMN NAMES `favorite` and `made`......
  //WORK ON THE ELEMENTS FOR THE LISTS favorite and made. DONE
  //WORK ON THE SUMBIT FORM AND ITS ELEMENTS. DONE*/
});

/*
----------------------------------
8 slices Brioche bread
4 Eggs
1 teaspoon Cinnamon
1/2 teaspoon Vanilla extract
1/4 teaspoon Nutmeg
1/4 cup Milk
2 tablespoon Sugar
1/2 cup Maple syrup
8 tablespoon Coconut oil
-----------------------------------
Mix the spices in a big plastic bowl.
Add the milk, vanilla extract and eggs to the mixture and whisk the mixture.
Dip each side of the bread for about 15 seconds
In a 12 quartz pan, add half of the oil and turn the heat to medium.
Fry 4 slices of bread, turning over when they are golden brown.
Wipe the pan clean when the first batch is ready and steps 4 - 5 for the second batch.
--------------------------------------------------------------------------------------
Hearty and yummy breakfast made with natural and healthy ingredients
---------------------------------------------------------------------------------------
15 minutes                                                            :PREP TIME
-----------------------------------------------------------------------------------------
30 minutes                                                            :COOK TIME
-------------------------------------------------------------------------------------------
4                                                                     :SERVING SIZE
----------------------------------------------------------------------------------------


--------------------------------------------------------------------------------------------
3 Avocados
1 large Tomato, chopped
1 Lime
2 Garlic cloves, minced
1/2 cup diced Onions
3 tablespoon Cilantro
3/4 teaspoon Cayenne pepper
3/4 teaspoon Paprika
1 teaspoon Pink Himalayan salt
-------------------------------------------------------------------------------------
Scoop the avocado pulp in a bowl and add the lime juice.
Add the spices to the bowl and mix until you have a smooth mixture.
Finally, add the tomatoes, onions and garlic and mix thoroughly. 
Taste the guacamole to see whether you should add more salt or pepper.
Put the guacamole in the refrigerator for about 2 hours before serving.
------------------------------------------------------------------------------------
Healthy and hearty meal or appetizer perfect for a small parties.
-----------------------------------------------------------------
20
--------------------
10
---------------------
6
----------------------
*/
