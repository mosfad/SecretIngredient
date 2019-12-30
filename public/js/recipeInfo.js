$(document).ready(function() {
  var recipeName = localStorage.getItem("recipeChosen");
  console.log(recipeName);

  var userId = "not a user";
  //var recipeId;

  $.ajax({
    type: "GET",
    url: "/api/author_data"
  })
    .done(function(authorData) {
      console.log(authorData);
      authorId = authorData.id;
    })
    .fail(function(jqXHR, textStatus, errThrown) {
      console.log(textStatus + ": " + errThrown);
    });
  var API = {
    getRecipeInfo: function(recipeName) {
      return $.ajax({
        type: "GET",
        url: "/api/recipeinfo/" + recipeName
      });
    },
    editRecipe: function() {
      return $.ajax({
        type: "POST",
        url: "/api/recipes/" + searchTerm
      });
    },
    bookmarkRecipe: function() {
      return $.ajax({
        type: "POST",
        url: "/api/recipes/" + searchTerm
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
    }
  };

  var processIngredients = function(ingredients) {
    var ingredientsArray = ingredients.split("\n");
    var list = $("<ul>")
      .attr("id", "ingredient-list")
      .appendTo($("#recipe-ingredients"));
    ingredientsArray.map(function(ingredient) {
      var listItem = $("<li>")
        .text(ingredient)
        .appendTo(list);
    });
  };

  var processDirections = function(directions) {
    var directionsArray = directions.split("\n");
    var list = $("<ol>").appendTo($("#recipe-directions"));
    directionsArray.map(function(direction) {
      var listItem = $("<li>")
        .text(direction)
        .appendTo(list);
    });
  };

  var processRatings = function(ratings) {
    var ratings = parseInt(ratings);
    //need to append each of the star spans to <p> after <br>
    for (var i = 0; i < 5; i++) {
      var starSpan = $("<span>");
      if (ratings > 0) {
        starSpan.attr("class", "checked");
      }
      starSpan
        .append(
          $("<i>")
            .attr("class", "material-icons")
            .text("star")
        )
        .appendTo($("#recipe-ratings"));
      ratings--;
    }
  };

  //
  var displayRecipeInfo = function() {
    API.getRecipeInfo(recipeName).then(function(recipe) {
      console.log(recipe);
      $("#recipe-name").text(recipe.recipe_name);
      $("#recipe-description").text(recipe.description);
      $("#prep-time").text("| Prep: " + recipe.prep_time);
      $("#cook-time").text(" | Cook: " + recipe.cook_time);
      $("#serving-size").text(
        " | Yield: " + recipe.serving_size + " servings |"
      );
      processIngredients(recipe.ingredients);
      processDirections(recipe.steps);
      processRatings(recipe.ratings);
      // $("#recipe-ingredients").text(recipe.ingredients);
      // $("#recipe-directions").text(recipe.steps);
      $("#recipe-image img").attr("src", recipe.imgUrl);
      //find a system to calculate overall ratings.
    });
  };
  var handleBookmarkRecipe = function() {
    if (authorId === "not a user") {
      alert("Please sign in or sign up to bookmark this recipe!");
    } else {
    }
  };

  var handleUpdateRecipe = function() {};
  displayRecipeInfo();
  $("#todo-save").on("click", handleBookmarkRecipe);
  $("#todo-edit").on("click", handleUpdateRecipe);
});
