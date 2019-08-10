$(document).ready(function() {
    console.log("I am inside the js for the author update!")
    //references to personal elements.
    var authorName = $("#author-name");
    var authorEmail = $("#author-email");
    var authorPassword = $("#author-password");
   
    //references to buttons.
    var buttonUpdateName = $("#update-name");
    var buttonUpdateEmail = $("#update-email");
    var buttonUpdatePassword = $("#update-password");
    //how do I get the author name or id from signup??? LOCAL STORAGE SHOULD HAPPEN HERE!
    var authorId = 2;
    var numOfRecipes;
    
   
    // The API object contains methods for each kind of request we'll make
    var API = {
        updateAccount: function(personalInfo) {
          return $.ajax({
            headers: {
              "Content-Type": "application/json"
            },
            type: "PUT",
            url: "/api/authors/" + authorId,
            data: JSON.stringify(personalInfo)
          });
        },
        getRecipes: function() {
          return $.ajax({
            url: "/api/authors/" + authorId,
            type: "GET"
          });
        },
    };

    //populates the table with the author's total number of recipes with an API request.
   /* var countRecipes = function() {
        API.getRecipes().then(function(data) {
          console.log("Here is the data from the server: ");
          console.log(data);
          //numOfRecipes = data[0].Recipes.length;
          numAuthorRecipes = 11;
          numAuthorRecipes.text("You have " + numOfRecipes + " recipes!");
        
        });
    };*/

    //populates the table with the author's personal details with an API request.
    /* var showAuthorDetails = function() {
        API.getAuthor().then(function(data) {
          console.log("Here is the data from the server: ");
          console.log(data);
          var authorTable = data[0];
          //clear the table cells receiving the data from the API
          authorName.empty();
          authorEmail.empty();
          authorPassword.empty();
          //filling table cells with author's data from the API.
          authorName.text(authorTable.author_name);
          authorEmail.text(authorTable.email);
          authorPassword.text(authorTable.password);
          //Get the author's number of recipes
          console.log(data[0].Recipes.length);
          numOfRecipes = authorTable.Recipes.length;
          numAuthorRecipes.text("You have " + numOfRecipes + " recipes!");

        });
    };*/
    //==========================================================================================================
    
    // handleFormSubmit is called when we update the user's account
    // Save the new example to the db and refresh the list
    var handleFormSubmit = function(event) {       //FORM SUBMIT ISN'T BEING HANDLED!
        event.preventDefault();
        var authorInfo;
        console.log("Handling the form submit....");
        //console.log(this.id);
        if (this.id == buttonUpdateName[0].id) {
          console.log("name change starts....")
          authorInfo = {
            author_name: authorName.val().trim()
          }
          console.log(authorInfo);
        }
        else if (this.id == buttonUpdateEmail[0].id) {
          console.log("email change starts....")
          authorInfo = {
            email: authorEmail.val().trim()
          }
          console.log(authorInfo);
        }
        else if (this.id == buttonUpdatePassword[0].id) {
          console.log("password chang starts....")
          authorInfo = {
            password: authorPassword.val().trim()
          }
          console.log(authorInfo);
        }
        /*var authorInfo = {
          author_name: authorName.val().trim(),
          email: authorEmail.val().trim(),
          password: authorPassword.val().trim()
        };*/
        console.log(authorInfo);
        API.updateAccount(authorInfo).then(function() {
            //Show a success message here
            console.log("Author was successfully added");
        });
        
        //clear the form after posting new recipe to the server.
        authorName.val("");
        authorEmail.val("");
        authorPassword.val("");

        //redirect back to the account page or profile page.
        window.location.href = "/account-settings";
    };
    

    //add event listeners to the edit buttons
    buttonUpdateName.on("click", handleFormSubmit);
    buttonUpdateEmail.on("click", handleFormSubmit);
    buttonUpdatePassword.on("click", handleFormSubmit);

    //I AM HERE: Write the code to handle click events. *Think of how to pass author's id to the webpage you will be redirected to.
});