$(document).ready(function() {
  $(".modal").modal();
  $(".sidenav").sidenav();
  var recipeName = localStorage.getItem("recipeChosen");
  console.log(recipeName);

  var userId = "not a user";
  var authorId;
  var recipeId;
  //var recipeId;

  $.ajax({
    type: "GET",
    url: "/api/author_data" /* This should be user*/
  })
    .done(function(authorData) {
      console.log(authorData);
      userId = authorData.id; // ***********************
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
    getFavoriteInfo: function(recipeName) {
      return $.ajax({
        type: "GET",
        url: "/api/favrecipeinfo/" + recipeName + "/" + userId
      });
    },

    addFavRecipe: function(favData) {
      return $.ajax({
        headers: {
          "Content-Type": "application/json"
        },
        type: "POST",
        url: "/api/favrecipes/" + userId + "/" + recipeId,
        data: JSON.stringify(favData)
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
      //cache recipe and author ids.
      recipeId = recipe.id; //*****************************************
      authorId = recipe.AuthorId; //************************************
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
    if (userId === "not a user") {
      alert("Please sign in or sign up to bookmark this recipe!");
    } else {
      API.getFavoriteInfo(recipeName).then(function(dbFavorite) {
        console.log(dbFavorite);
        //First check whether DB returns null object
        if (dbFavorite == null) {
          console.log({ name: recipeName, AuthorId: authorId });
          API.addFavRecipe({ name: recipeName, AuthorId: authorId }).then(
            function(dbFavorite) {
              alert("Congrats, you have successfully bookmarked this recipe");
            }
          );
        } else {
          //If user has already bookmarked this recipe, then send an alert.
          if (dbFavorite.userId === userId) {
            alert("You have already bookmarked this recipe!");
            return;
          } else {
            //If DB isn't empty, but user hasn't bookmarked this recipe, then do so.
            API.addFavRecipe({ name: recipeName, AuthorId: authorId }).then(
              function(dbFavorite) {
                alert("Congrats, you have successfully bookmarked this recipe");
              }
            );
          }
        }
        //
      });
    }
  };

  var handleUpdateForm = function() {
    //If user didn't create recipe, prevent user from updating this recipe
    console.log("user id is " + userId);
    console.log(`author id is ${authorId}`);
    console.log(`recipe id is ${recipeId}`);
    if (authorId !== userId) {
      //User didn't create the recipe; don't allow this user to edit it.
      alert("Sorry, you can only edit recipes you created.");
      location.reload();
    } else {
      //POPULATE THE TEXT FIELD WITH INFO FROM RECIPE TABLE BEFORE MOVING TO THE NEXT STEP.
      API.getRecipeInfo(recipeName).then(function(recipe) {
        console.log(recipe);

        // $("#recipe-name").text(recipe.recipe_name);
        // $("#recipe-description").text(recipe.description);
        // $("#prep-time").text("| Prep: " + recipe.prep_time);
        // $("#cook-time").text(" | Cook: " + recipe.cook_time);
        // $("#serving-size").text(
        //   " | Yield: " + recipe.serving_size + " servings |"
        // );
        // $("#recipe-image img").attr("src", recipe.imgUrl);

        $("#addrecipe-name").val(recipe.recipe_name);
        $("#addrecipe-ingredients").val(recipe.ingredients);
        $("#addrecipe-steps").val(recipe.steps);
        $("#addrecipe-description").val(recipe.description);
        $("#addprep-time").val(recipe.prep_time);
        $("#addcook-time").val(recipe.cook_time);
        $("#addserving-size").val(recipe.serving_size);
      });
    }
  };

  var handleUpdateSubmit = function(event) {
    event.preventDefault();
    var recipeUpdateData = {};
    var recipeFormData = new FormData($("#update-recipe-form")[0]);
    API.getRecipeInfo(recipeName).then(function(recipe) {
      console.log(recipe);
      var i = 0;
      console.log(recipeFormData);
      for (var pair of recipeFormData.entries()) {
        console.log(pair[0]);
        console.log(pair[1]);
        // i++;
        // console.log(i);
        // if (i % 2) {
        //   recipeUpdateData[pair[0]] = pair[1];
        // }
        //NEED ANTOTHER WAY TO COMPARE DB INFO TO USER INPUT.
        switch (pair[1]) {
          case recipe.recipe_name:
            recipeUpdateData[pair[0]] = pair[1];
            break;
          case recipe.ingredients:
            recipeUpdateData[pair[0]] = pair[1];
            break;
          case recipe.steps:
            recipeUpdateData[pair[0]] = pair[1];
            break;
          case recipe.description:
            recipeUpdateData[pair[0]] = pair[1];
            break;
          case recipe.prep_time:
            recipeUpdateData[pair[0]] = pair[1];
            break;
          case recipe.cook_time:
            recipeUpdateData[pair[0]] = pair[1];
            break;
          case recipe.serving_size:
            recipeUpdateData[pair[0]] = pair[1];
            break;
        }

        // if (pair[1].name === "") {
        //   //delete recipeFormData.pair[0];
        //   console.log("No change with image input");
        // } else if (
        //   pair[1] !== recipe.recipe_name ||
        //   pair[1] !== recipe.ingredients ||
        //   pair[1] !== recipe.steps ||
        //   pair[1] !== recipe.description ||
        //   pair[1] !== recipe.prep_time ||
        //   pair[1] !== recipe.cook_time ||
        //   pair[1] !== recipe.serving_size
        // ) {
        //   //delete recipeFormData.pair[0];
        //   console.log("text input changed ....");
        //   recipeUpdateData[pair[0]] = pair[1];
        // }
      }
      console.log(recipeUpdateData);
    });
  };
  //Allow user who created recipe to edit it. MAY NOT REQUIRE UPDATEBTN!!!
  // var updatebtn = $("<span>").append(
  //   $("<a>")
  //     .addClass("waves-effect waves-light btn red")
  //     .attr("id", "confirm-edit")
  //     .append(
  //       $("<i>")
  //         .addClass("material-icons")
  //         .text("update")
  //     )
  //     .text("Confirm Update")
  // );
  // $("#recipe-details")
  //   .append(updatebtn)
  //   .append($("<br>"));

  displayRecipeInfo();
  $("#todo-save").on("click", handleBookmarkRecipe);
  $("#todo-edit").on("click", handleUpdateForm);
  $("#submit-update").on("click", handleUpdateSubmit);
});
