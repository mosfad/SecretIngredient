function submitRecipe(event){

    // event.preventDefault();
    var recipeName = $('#recipeName').val();
    var ingredients= $('#ingredients').val();
    var steps= $('#steps').val();
    var comments= $('#comments').val();
    var imgUrl= $('#imgUrl').val();
    
    console.log(recipeName );
    console.log(ingredients);
    console.log(steps);
    console.log(comments);
    console.log(imgUrl);
    console.log('Recipe function')

    // Send the POST request.
    var recipe = {
        recipeName: $("#recipeName").val().trim(),
        ingredients:$("#ingredients").val().trim(),
        steps:$("#steps").val().trim(),
        comments:$("#comments").val().trim(),
        imgUrl:$("#imgUrl").val().trim()
    };

    $.ajax("/api/recipe", {
        type: "POST",
        data: recipe
      }).then(
        function(Recipe) {
          console.log(Recipe);
          // Reload the page to get the updated list
            // location.reload();
        }
      );

    }
$("#submitRecipe").on('click', submitRecipe);