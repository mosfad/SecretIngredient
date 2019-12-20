$(document).ready(function() {
  $(".modal").modal();
  $(".sidenav").sidenav();
  //references to unordered lists that will display recipes.
  var favRecipesList = $("#favorite-recipes");
  var madeRecipesList = $("#made-recipes");
  //references to form elements
  var recipeName = $("#recipeName");
  var recipeIngredients = $("#recipeIngredients");
  var recipeSteps = $("#recipeSteps");
  var recipeComments = $("#recipeComments");
  var recipeImgUrl = $("#recipeImg");
  //references to icons and buttons that trigger events
  var buttonSubmitRecipe = $("#submit-recipe"); //now using***
  var modalSubmitRecipe = $("#modal-submit");
  var iRevealMadeRecipe = $("#reveal-made-recipes");
  var iRevealFavRecipe = $("#reveal-fav-recipes");

  var authorId;
  var recipeId;

  $.ajax({
    type: "GET",
    url: "/api/author_data"
  })
    .done(function(authorData) {
      console.log(authorData);
      authorId = authorData.id;
      console.log(authorId);
      console.log("Displaying my recipes....");
      displayMyRecipes();
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
    // addIngredients: function(ingredients) {
    //   return $.ajax({
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     type: "POST",
    //     url: "/api/recipe/ingredients/" + recipeId,
    //     data: JSON.stringify(ingredients)
    //   });
    // },
    // addDirections: function(directions) {
    //   return $.ajax({
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     type: "POST",
    //     url: "/api/recipe/directions/" + recipeId,
    //     data: JSON.stringify(directions)
    //   });
    // },
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
        url: "/api/favorites/" + userId,
        type: "GET"
      });
    }
  };

  //SHOW FAVORITE RECIPES**
  //SHOW CREATED RECIPE**

  /*
  HOW TO EFFICENTLY MANAGE THIS MySQL CONFLICT......
  userId = id of the user that bookmarks a recipe
  authorId = id of the user that creates a recipe.
 */
  var displayMyRecipes = function() {
    console.log("I am inside the function");
    API.getMyRecipes().then(function(data) {
      console.log("I am inside the API to get my recipes...");
      console.log(data);
      var prevRow;
      data.map(function(recipe, index) {
        //how do I attach each column(entry) to the previous row or column????****
        console.log(recipe);
        console.log(index);
        //var row = $("<div>").attr("class", "row");
        var col = $("<div>").attr("class", "col s12 m3");
        //Give each card unique row and col to appropriately append subsequent card.
        var numOfRow = Math.floor(index / 4);
        var numOfCol = index % 4;
        //row.attr("id", "row" + numOfRow);
        col.attr("id", "col" + numOfCol);
        //HOW DO I GET THE CARDS TO LINE UP HORIZONTALLY????!!!!!!!
        if (index % 4 === 0) {
          var row = $("<div>").attr("class", "row");
          $("#recipe-container").append(row);
          row.append(col);
        } else {
          $("#recipe-container .row:last-child").append(col);
        }
        //$("#recipe-container").append(row);
        //row.append(col);

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
        var recipeTitle = $("<p>")
          .attr("class", "recipeTitle")
          .text(recipe.recipe_name)
          .appendTo(cardContent);
        var comments = $("<p>")
          .append($("<span>").attr("class", "comments"))
          .append($("<strong>").text(recipe.comments))
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

  var displayFavRecipes;

  /*
  //populates the recipe cards based on the parameter `column name` i.e made recipes or favorite recipes.
  var showFavRecipes = function(cardList) {
    API.getFavRecipes().then(function(data) {
      console.log("Here is the data from the server: ");
      console.log(data);
      data = [data];
      var recipes = data.map(function(recipe) {
        console.log("Trying to figure out what data.map does; recipe = ");
        console.log(recipe);

        var i = $("<i>")
          .text("pageview")
          .attr({
            class: "material-icons"
          });

        var a = $("<a>")
          .text("VIEW")
          .attr({
            class: "waves-effect waves-light btn-small grey darken-2"
          })
          .append(i);

        var li = $("<li>")
          .text(recipe.favourite + "  ")
          .attr({
            class: "collection-item"
          })
          .append("<br/>")
          .append(a);
        return li;
      });
      console.log("Extracting favorite recipe from data: ");
      console.log(recipes);
      cardList.empty(); // I AM RIGHT HERE !
      cardList.append(recipes); // I AM RIGHT HERE !
    });
  };

  //populates the recipe cards based on the parameter `column name` i.e made recipes or favorite recipes.
  var showMadeRecipes = function(cardList) {
    API.getAllRecipes().then(function(data) {
      console.log("Here is the data from the server: ");
      console.log(data);
      var recipes = data.map(function(recipe) {
        console.log("Trying to figure out what data.map does; recipe = ");
        console.log(recipe);

        var iView = $("<i>")
          .text("pageview")
          .attr({
            class: "material-icons"
          });
        var iUpdate = $("<i>")
          .text("update")
          .attr({
            class: "material-icons"
          });

        var aView = $("<a>")
          .text("VIEW")
          .attr({
            class: "waves-effect waves-light btn-small grey darken-2"
          })
          .append(iView);

        var aUpdate = $("<a>")
          .text("UPDATE")
          .attr({
            class: "waves-effect waves-light btn-small red darken-1"
          })
          .append(iUpdate);

        var li = $("<li>")
          .text(recipe.recipe_name + "  ")
          .attr({
            class: "collection-item"
          })
          .append("<br/>")
          .append(aView)
          .append(aUpdate);
        return li;
      });
      console.log("Extracting favorite recipe from data: ");
      console.log(recipes);
      cardList.empty(); // I AM RIGHT HERE !
      cardList.append(recipes); // I AM RIGHT HERE !
    });
  };

  // handleFormSubmit is called whenever we add(submit) a new recipe
  // Save the new example to the db and refresh the list
  var handleFormSubmit = function(event) {
    //FORM SUBMIT ISN'T BEING HANDLED!
    event.preventDefault();
    console.log("I was called....");
    var recipe = {
      recipe_name: recipeName.val().trim(),
      ingredients: recipeIngredients.val().trim(),
      steps: recipeSteps.val().trim(),
      comments: recipeComments.val().trim(),
      //imgUrl: recipeImgUrl.val().trim(),
      AuthorId: authorId
    };
    console.log(recipe);
    API.addRecipes(recipe).then(function() {
      //show updated displays of favorite recipes and made recipes.
      showMadeRecipes(favRecipesList);
      showMadeRecipes(madeRecipesList);
      console.log("Recipe was successfully posted");
    });

    //clear the form after posting new recipe to the server.
    recipeName.val("");
    recipeIngredients.val("");
    recipeSteps.val("");
    recipeComments.val("");
    //recipeImgUrl.val("");
  };

  // Add event listener to the submit button
  buttonSubmitRecipe.on("click", handleFormSubmit);
  //Add event listener for icons to reveal recipes
  // iRevealFavRecipe.on("click", function() {
  //   console.log("clicked");
  //   $.ajax({
  //     method: "Get",
  //     url: "/api/authors/" + sessionStorage.getItem("userIdSession")
  //   }).then(function(user) {
  //     console.log("user");
  //   });
  // });
  iRevealFavRecipe.on("click", showFavRecipes(favRecipesList));
  iRevealMadeRecipe.on("click", showMadeRecipes(madeRecipesList));*/
  var handleFormSubmit = function(event) {
    event.preventDefault();
    console.log("The modal enters the form correctly!!!");
    var recipeFormData = new FormData($("#new-recipe-form")[0]);
    /*var recipeFormData = {
      recipe_name: recipeName.val().trim(),
      ingredients: recipeIngredients.val().trim(),
      steps: recipeSteps.val().trim(),
      comments: recipeComments.val().trim(),
      ratings: 0,
      imgUrl: recipeImgUrl.val().trim()
    };*/
    console.log(recipeFormData);
    for (var pair of recipeFormData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
      console.log(pair[1]);
    }
    // API.addMyRecipe(recipeFormData).done(function(response) {
    //   console.log(response);
    // });
    var postRecipe = API.addMyRecipe(recipeFormData);
    // var postIngredient = postRecipe.then(function(data) {
    //   API.addFavRecipe;
    // });
  };
  //Add event listener to submit button
  //   $("#modal1").on("click", buttonSubmitRecipe, handleFormSubmit);
  buttonSubmitRecipe.on("click", handleFormSubmit);
  //MAKE SURE THAT THE DATABASE HAS COLUMN NAMES `favorite` and `made`......
  //WORK ON THE ELEMENTS FOR THE LISTS favorite and made. DONE
  //WORK ON THE SUMBIT FORM AND ITS ELEMENTS. DONE*/
});
