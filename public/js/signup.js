function signup(event) {
  // event.preventDefault();
  // var userEmail = $('#userName').val();
  // var userPass= $('#password').val();
  // console.log(userEmail);
  // console.log(userPass);
  console.log("SignUp function");

  // Send the POST request.
  var newAuthor = {
    email: $("#user-email")
      .val()
      .trim(),
    password: $("#user-password")
      .val()
      .trim()
  };

  $.ajax("/api/signup", {
    type: "POST",
    data: newAuthor
  }).then(function(response) {
    console.log("Welcome New Author");
    console.log(response.error);
    // Reload the page to get the updated list
    // location.reload();
    //window.location.href = '/profile-page';

    if (response.error) {
      console.log("Login Incorrect");
      alert("Incorrect email format please type again");
      window.location.href = "/sign-up.html";
    } else {
      console.log("Response is true, so redirecting to profile-page....");
      window.location.href = "/profile-page";
    }
  });
}

$("#user-signup").on("click", signup);



/*function signup(event){

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
*/


