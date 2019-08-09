var search = "";
// var app = require('../../routes/apiRoutesRecipe')


$("#search-button").on("click", function(event){

    event.preventDefault();
    
    search = $("#search-bar").val().trim();
    console.log(search);
    $.get(`/api/search-keyword/${search}`, {search: search}).then(function(res){
        console.log(res);
    })
});