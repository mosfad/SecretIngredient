var search = "";
// var app = require('../../routes/apiRoutesRecipe')


$("#search-button").on("click", function(event){

    event.preventDefault();
    
    search = $("#search-bar").val().trim();
    console.log(search);
    $.get(`/api/search-keyword/${search}`, {search: search}).then(function(res){
        console.log(res);
        console.log(res[0].recipe_name);
        $("#recipe-view").empty();
        $("#recipe-view").append('<ul class="collection with-header"></ul>');
        $("#recipe-view").append('<ol class="collection-header"><h4>'+res.length+' Results for '+search+ '</h4></ol>');
        for (var i =0; i < res.length; i++)
        {
        $("#recipe-view").append('<li class="collection-item card-panel" data-name="'+i+'">'+ res[i].recipe_name+'</li>');
        }

        $(".collection-item").on("click", function(){
            var recipe = $(this).attr('data-name');
            $("#recipe-view").empty();

            $("recipe-view").append('<div id="card3" class="card-panel pink darken-3">')
            $("recipe-view").append('<div id="card2" class="card-panel pink darken-3">')
            // var ingredients = res[].ingredients;
            // var
            //MIGHT NEED TO CHANGE THE OPTION FOR THE 'split()' METHOD BASED ON USER INPUT.
            var ingredientsArr = res[recipe].ingredients.split(', ');
            var stepsArr = res[recipe].steps.split('.');
            console.log(ingredientsArr);
            $("#recipe-view").append("<h4>Ingredients</h4>");
            for (var i =0; i < ingredientsArr.length; i++){
                console.log(ingredientsArr[i]);
                $("#recipe-view").append("<p>-"+ingredientsArr[i]+"</p>");
            }
            $("#recipe-view").append("<h4>Steps</h4>");
            for (var i =0; i < stepsArr.length; i++){
                console.log(stepsArr[i]);
                $("#recipe-view").append("<p>-"+stepsArr[i]+"</p>");
            }
        })
    })
});