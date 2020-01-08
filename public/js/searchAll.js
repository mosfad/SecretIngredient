//var search = "";
// var app = require('../../routes/apiRoutesRecipe')

$(document).ready(function() {
  $(".sidenav").sidenav();
  var userId;

  $.ajax({
    type: "GET",
    url: "/api/author_data" /* This should be user*/
  })
    .done(function(authorData) {
      userId = authorData.id;
      //console.log("userId is " + userId); ***
      if (userId === undefined) {
        $(".prof-nav").addClass("hide");
      } else {
        $(".signin-nav").addClass("hide");
      }
    })
    .fail(function(jqXHR, textStatus, errThrown) {
      console.log(textStatus + ": " + errThrown);
    });

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

  //Show recipes created by ALL the users.
  var displayAllRecipes = function() {
    API.getAllRecipes().then(function(data) {
      //console.log(data);***
      data.map(function(recipe, index) {
        //console.log(recipe); ***
        //console.log(index); ***
        var col = $("<div>").attr("class", "col s12 m3");
        //Give each card unique row and col to appropriately append subsequent card.
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

  //Shows all the recipes that contain the search term entered by the user.
  var displaySelectedRecipes = function(searchTerm) {
    API.getAllRecipes().then(function(data) {
      //console.log(data); ***
      searchTerm = searchTerm.toLowerCase();
      clearRecipes();
      var selectedRecipesArr = data.filter(function(recipe, index) {
        return recipe.recipe_name.toLowerCase().includes(searchTerm);
      });
      //console.log(selectedRecipesArr); ***
      //If filtered array is empty then the results should be empty.........
      selectedRecipesArr.map(function(recipe, index) {
        // console.log(recipe); ***
        // console.log(index); ***
        var col = $("<div>").attr("class", "col s12 m3");
        //Give each card unique row and col to appropriately append subsequent card.
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
  // var displayRecipeInfo = function(recipeName) {
  //   console.log("Getting the details for the chosen recipe...");
  //   API.getRecipeInfo(recipeName).then(function(recipe) {
  //     //Maybe use local storage to store selectedRecipe info so that
  //     //`recipe-info.html & recipe.js can have access to the info*******************
  //     console.log(recipe);
  //   });
  // };

  //
  displayAllRecipes();

  var handleRecipeSearch = function(event) {
    //Prevent default behavior of submitting form.
    event.preventDefault();
    //Display recipes based on search term user enters.******************
    var searchTerm = $("#search-bar")
      .val()
      .trim();
    //console.log(searchTerm); ***
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
    event.preventDefault();
    var recipeName = $(this).text();
    if (localStorage.getItem("recipeChosen")) {
      localStorage.clear();
    }
    localStorage.setItem("recipeChosen", recipeName);
    location.href = "/recipeinfo";
  };
  $("#search-button").on("click", handleRecipeSearch);
  $("#recipe-view").on("click", ".recipeTitle", handleRecipeRequest);
});
