function signup(event){

    // event.preventDefault();
    var userEmail = $('#userName').val();
    var userPass= $('#password').val();
    console.log(userEmail);
    console.log(userPass);
    console.log('SignUp function')

    // Send the POST request.
    var newAuthor = {
        email: $("#userName").val().trim(),
        password:$("#password").val().trim()
    };

    $.ajax("/api/signup", {
        type: "POST",
        data: newAuthor
      }).then(
        function() {
          console.log("created new Author");
          // Reload the page to get the updated list
          location.reload();
        }
      );

    }
$("#signup").on('click', signup);