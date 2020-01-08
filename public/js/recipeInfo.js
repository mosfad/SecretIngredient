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
      //console.log(authorData);***
      userId = authorData.id;
      //console.log("userId is " + userId);***
      if (userId === undefined) {
        $(".prof-nav").addClass("hide");
        $(".logout-nav").addClass("hide");
      } else {
        $(".signin-nav").addClass("hide");
      }
    })
    .fail(function(jqXHR, textStatus, errThrown) {
      console.log(textStatus + ": " + errThrown);
    });
  var API = {
    getRecipeInfo: function(recipeField) {
      return $.ajax({
        type: "GET",
        url: "/api/recipeinfo/" + recipeField
      });
    },
    // editRecipe: function() {
    //   return $.ajax({
    //     type: "POST",
    //     url: "/api/recipes/" + searchTerm
    //   });
    // },
    editRecipe: function(recipe) {
      return $.ajax({
        type: "PUT",
        enctype: "multipart/form-data",
        url: "/api/recipes/" + userId + "/" + recipeId,
        data: recipe,
        processData: false,
        contentType: false,
        cache: false,
        //timeout: 600000,
        success: function(data) {
          alert("Recipe successfully updated!");
          console.log("SUCCESS : ", data);
        },
        error: function(e) {
          alert("Recipe was not added! Please try again.");
          console.log("ERROR : ", e);
        }
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
      //console.log(recipe); ***
      //cache recipe and author ids.
      recipeId = recipe.id;
      authorId = recipe.AuthorId;
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
        //console.log(dbFavorite);***
        //First check whether DB returns null object
        if (dbFavorite == null) {
          //console.log({ name: recipeName, AuthorId: authorId });***
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
      //console.log(recipeFormData);
      for (var pair of recipeFormData.entries()) {
        console.log(pair[0]);
        console.log(pair[1]);
        // if (pair[0] === "servingSize") {
        //   console.log(recipe.serving_size);
        //   console.log(typeof recipe.serving_size);
        //   console.log(typeof pair[0]);
        //   console.log(typeof pair[1]);
        // }
        // if (pair[0] === "prepTime") {
        //   console.log(recipe.prep_time === pair[1]);
        //   console.log(typeof recipe.prep_time);
        //   console.log(typeof pair[0]);
        //   console.log(typeof pair[1]);
        // }

        // switch (pair[0]) {
        //   case "recipeName":
        //     if (pair[1] === recipe.recipe_name) delete recipeFormData[pair[0]];
        //     console.log("Match made with " + pair[0]);
        //     break;
        //   case "recipeIngredients":
        //     if (pair[1] === recipe.ingredients) delete recipeFormData[pair[0]];
        //     console.log("Match made with " + pair[0]);
        //     break;
        //   case "recipeSteps":
        //     if (pair[1] === recipe.steps) delete recipeFormData[pair[0]];
        //     console.log("Match made with " + pair[0]);
        //     break;
        //   case "recipeDescription":
        //     if (pair[1] === recipe.description) delete recipeFormData[pair[0]];
        //     console.log("Match made with " + pair[0]);
        //     break;
        //   case "prepTime":
        //     if (pair[1] === recipe.prep_time) delete recipeFormData[pair[0]];
        //     console.log("Match made with " + pair[0]);
        //   case "cookTime":
        //     if (pair[1] === recipe.cook_time) delete recipeFormData[pair[0]];
        //     console.log("Match made with " + pair[0]);
        //     break;
        //   case "servingSize":
        //     if (pair[1] === recipe.serving_size.toString())
        //       delete recipeFormData[pair[0]];
        //     console.log("Match made with " + pair[0]);
        //     break;
        //   default:
        //     console.log("No match here....");
        // }
        /*FALLBACK CODE IF I'M NOT ABLE TO UPDATE THE IMAGE......
        switch (pair[0]) {
          case "recipeName":
            if (pair[1] !== recipe.recipe_name)
              recipeUpdateData[pair[0]] = pair[1];
            break;
          case "recipeIngredients":
            if (pair[1] !== recipe.ingredients)
              recipeUpdateData[pair[0]] = pair[1];
            break;
          case "recipeSteps":
            if (pair[1] !== recipe.steps) recipeUpdateData[pair[0]] = pair[1];
            break;
          case "recipeDescription":
            if (pair[1] !== recipe.description)
              recipeUpdateData[pair[0]] = pair[1];
            break;
          case "prepTime":
            if (pair[1] !== recipe.prep_time)
              recipeUpdateData[pair[0]] = pair[1];
            break;
          case "cookTime":
            if (pair[1] !== recipe.cook_time)
              recipeUpdateData[pair[0]] = pair[1];
            break;
          case "servingSize":
            if (pair[1] !== recipe.serving_size.toString())
              recipeUpdateData[pair[0]] = pair[1];
            break;
          // case "recipeImage":
          //   if (pair[1].name !== recipe.imgUrl)
          //     recipeUpdateData[pair[0]] = pair[1];
          //   break;
          default:
            console.log("No match here....");
        }*/
      }
      // for (var pair of recipeFormData.entries()) {
      //   console.log(pair[0]);
      //   console.log(pair[1]);
      // }
      //console.log(recipeUpdateData);
      API.editRecipe(recipeFormData).then(function(arrResponse) {
        console.log(arrResponse);
        if (Array.isArray(arrResponse) && arrResponse.length >= 1) {
          //Check and update recipe name(if necessary), after successful recipe edit.
          console.log(recipeId);
          API.getRecipeInfo(recipeId).then(function(dbRecipe) {
            console.log("Recipe id after update: " + dbRecipe.id);
            console.log("Recipe name after update: " + dbRecipe.recipe_name);
            if (recipeName !== dbRecipe.recipe_name) {
              //if recipe name was changed, then update locally stored recipe name!
              localStorage.setItem("recipeChosen", dbRecipe.recipe_name);
              location.reload();
            }
          });
        } else {
          //Unsuccessful recipe edit!!!
          alert("Recipe was not updated! Please try again");
          location.reload();
        }
        //
      });
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
