$(document).ready(function() {
  //Get references from our form inputs
  var emailInput = $("#user-email");
  var passwordInput = $("#user-password");

  //When user clicks signup button, we validate the email and password are not blank.
  $("#user-signup").on("submit", function(event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };
    if (!userData.email || !userData.password) {
      return;
    }
    //Helper to sign up user
    signupUser(userData.email, userData.password);
    //Empty form fields.
    emailInput.val("");
    passwordInput.val("");
  });

  function signupUser(email, password) {
    $.ajax({
      url: "/api/signup",
      type: "POST",
      data: {
        email: email,
        password: password
      }
    })
      .then(function(data) {
        console.log("Welcome to your new account");
        //Set location to appropropriate route on successful signup
        window.location.replace(data);
      })
      .catch(handleLoginError);
  }

  function handleLoginError(error) {
    alert(err.responseJSON);
    // $(" ").text(err.responseJSON);
    // $(" ").fadeIn(500);
  }
});

//==========================================================================================================
// function signup(event) {
//   // event.preventDefault();
//   // var userEmail = $('#userName').val();
//   // var userPass= $('#password').val();
//   // console.log(userEmail);
//   // console.log(userPass);
//   console.log("SignUp function");

//   // Send the POST request.
//   var newAuthor = {
//     email: $("#user-email")
//       .val()
//       .trim(),
//     password: $("#user-password")
//       .val()
//       .trim()
//   };

//   $.ajax("/api/signup", {
//     type: "POST",
//     data: newAuthor
//   }).then(function(response) {
//     console.log("Welcome New Author");
//     console.log(response.error);
//     // Reload the page to get the updated list
//     // location.reload();
//     //window.location.href = '/profile-page';

//     if (response.error) {
//       console.log("Login Incorrect");
//       alert("Incorrect email format please type again");
//       window.location.href = "/sign-up.html";
//     } else {
//       console.log("Response is true, so redirecting to profile-page....");
//       window.location.href = "/profile-page";
//     }
//   });
// }

// $("#user-signup").on("click", signup);
