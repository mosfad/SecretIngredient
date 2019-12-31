//var search = "";
// var app = require('../../routes/apiRoutesRecipe')

$(document).ready(function() {
  var API = {
    getAllRecipes: function() {
      return $.ajax({
        type: "GET",
        url: "/api/allrecipes/"
      });
    },
    getSelectedRecipe: function() {
      return $.ajax({
        type: "GET",
        url: "/api/recipes/" + searchTerm
      });
    },
    getRecipeInfo: function(recipeName) {
      return $.ajax({
        type: "GET",
        url: "/api/recipeinfo/" + recipeName
      });
    }
  };

  //
  var displayAllRecipes = function() {
    console.log("I am inside the function that displays all the recipes");
    API.getAllRecipes().then(function(data) {
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
          //Create and add new row to the DOM to hold next four recipe
          var row = $("<div>").attr("class", "row");
          $("#recipe-view").append(row);
          row.append(col);
        } else {
          //Add recipe to current row, which has an open slot to hold current recipe.
          $("#recipe-view .row:last-child").append(col);
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
        var recipeTitle = $("<a>")
          .attr("href", "/recipeinfo")
          .addClass("recipeTitle")
          .text(recipe.recipe_name)
          .appendTo(cardContent);
        var description = $("<p>")
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
            .appendTo(description);
          numRatings--;
        }
      });
    });
  };

  //
  var displaySelectedRecipes = function(searchTerm) {
    console.log("I am inside the function");
    API.getAllRecipes().then(function(data) {
      console.log("I am inside the API to get my recipes...");
      console.log(data);
      searchTerm = searchTerm.toLowerCase();
      clearRecipes();
      var selectedRecipesArr = data.filter(function(recipe, index) {
        return recipe.recipe_name.toLowerCase().includes(searchTerm);
      });
      console.log(selectedRecipesArr);
      //Create a function that will take in `recipe` and `index` to build cards
      /* 
      var buildRecipeCards = function(recipe, index) { callback function in array.map goes here }
      */
      //If filtered array is empty then the results should be empty.........
      selectedRecipesArr.map(function(recipe, index) {
        console.log(recipe);
        console.log(index);
        var col = $("<div>").attr("class", "col s12 m3");
        //Give each card unique row and col to appropriately append subsequent card.
        //var numOfRow = Math.floor(index / 4);
        var numOfCol = index % 4;
        col.attr("id", "col-entry" + index);
        if (numOfCol === 0) {
          //Create and add new row to the DOM to hold next four recipe
          var row = $("<div>").attr("class", "row");
          $("#recipe-view").append(row);
          row.append(col);
        } else {
          //Add recipe to current row, which an open slot to hold current recipe.
          $("#recipe-view .row:last-child").append(col);
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
        var recipeTitle = $("<a>")
          .attr("href", "/recipeinfo")
          .addClass("recipeTitle")
          .text(recipe.recipe_name)
          .appendTo(cardContent);
        var description = $("<p>")
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
            .appendTo(description);
          numRatings--;
        }
      });
      //clear the searchTerm in the search form.
      $("#search-bar").val("");
    });
  };

  //
  var clearRecipes = function() {
    $("#recipe-view").empty();
  };

  //Extract recipe info from API and display it.
  var displayRecipeInfo = function(recipeName) {
    console.log("Getting the details for the chosen recipe...");
    API.getRecipeInfo(recipeName).then(function(recipe) {
      //Maybe use local storage to store selectedRecipe info so that
      //`recipe-info.html & recipe.js can have access to the info*******************
      console.log(recipe);
    });
  };

  //
  displayAllRecipes();

  var handleRecipeSearch = function(event) {
    //Prevent default behavior of submitting form.
    event.preventDefault();
    //Display recipes based on search term user enters.******************
    var searchTerm = $("#search-bar")
      .val()
      .trim();
    console.log(searchTerm);
    //If searchTerm is an empty string then reload page.
    if (searchTerm === "") {
      window.location.reload();
    } else {
      //Create a function that returns the recipes with the chosen search term in its title
      displaySelectedRecipes(searchTerm);
    }
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

    //consoe.log("Selected Recipe is: " + recipeName);
    //displayRecipeInfo(recipeName);
    location.href = "/recipeinfo";
  };
  $("#search-button").on("click", handleRecipeSearch);
  $("#recipe-view").on("click", ".recipeTitle", handleRecipeRequest);
});

// $("#search-button").on("click", function(event) {
//   event.preventDefault();

//   search = $("#search-bar")
//     .val()
//     .trim();
//   console.log(search);
//   $.get(`/api/search-keyword/${search}`, { search: search }).then(function(
//     res
//   ) {
//     console.log(res[0].recipe_name);
//     $("#recipe-view").empty();
//     $("#recipe-view").append('<ul class="collection with-header"></ul>');
//     $("#recipe-view").append(
//       '<ol class="collection-header"><h4>' +
//         res.length +
//         " Results for " +
//         search +
//         "</h4></ol>"
//     );
//     for (var i = 0; i < res.length; i++) {
//       $("#recipe-view").append(
//         '<li class="collection-item card-panel" data-name="' +
//           i +
//           '">' +
//           res[i].recipe_name +
//           "</li>"
//       );
//     }

//     $(".collection-item").on("click", function() {
//       var recipe = $(this).attr("data-name");
//       $("#recipe-view").empty();

//       $("recipe-view").append(
//         '<div id="card3" class="card-panel pink darken-3">'
//       );
//       $("recipe-view").append(
//         '<div id="card2" class="card-panel pink darken-3">'
//       );
//       // var ingredients = res[].ingredients;
//       // var
//       var ingredientsArr = res[recipe].ingredients.split(",");
//       var stepsArr = res[recipe].steps.split(";");
//       console.log(ingredientsArr);
//       $("#recipe-view").append("<h4>Ingridients</h4>");
//       for (var i = 0; i < ingredientsArr.length; i++) {
//         console.log(ingredientsArr[i]);
//         $("#recipe-view").append("<p>-" + ingredientsArr[i] + "</p>");
//       }
//       $("#recipe-view").append("<h4>Steps</h4>");
//       for (var i = 0; i < stepsArr.length; i++) {
//         console.log(stepsArr[i]);
//         $("#recipe-view").append("<p>-" + stepsArr[i] + "</p>");
//       }
//     });
//   });
//});
