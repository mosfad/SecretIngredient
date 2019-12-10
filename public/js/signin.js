$(document).ready(function() {
  var emailInput = $("#user-email");
  var passwordInput = $("#user-password");

  //When user clicks login button, we validate the email and password are not blank.
  $("#user-signin").on("submit", function(event) {
    event.preventDefault();
    var userInput = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };
    //Validate the email and password inputs
    if (!userInput.email || !userInput.password) {
      return;
    }
    signin(userInput.email, userInput.password);
    //clear the form inputs
    emailInput.val("");
    passwordInput.val("");
  });

  //signin function makes a POST request to /api/signin and redirects
  //the user to the page for registered users on a successful log in.
  function signin(email, password) {
    $.ajax({
      url: "/api/signin",
      type: "POST",
      data: {
        email: email,
        password: password
      }
    })
      .then(function(data) {
        console.log("Welcome to your account");
        //Set location to appropropriate route on successful signup
        window.location.replace(data);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

// function signin(event) {
//   console.log("Signin function");
//   // Send the POST request.
//   var newAuthor = {
//     email: $("#user-email")
//       .val()
//       .trim(),
//     password: $("#user-password")
//       .val()
//       .trim()
//   };

//   $.ajax("/api/signin", {
//     type: "POST",
//     data: newAuthor
//     url: "/api/signin"
//   }).then(function(response) {
//     console.log("Welcome Author");
//     console.log(response);
//     // Reload the page to get the updated list
//     // location.reload();
//     //window.location.href = '/profile-page';

//     if (response !== null) {
//       console.log("Response is true, so redirecting to profile-page....");
//       window.location.href = "/profile-page";
//     } else {
//       console.log("Login Incorrect");
//       alert("Incorrect email or password");
//     }
//   });
// }
// $("#user-signin").on("click", signin);
//=======================================================================================================
// $(document).ready(function() {
//   function signin(event) {
//     event.preventDefault();
//     var userEmail = $("#user-email").val();
//     var userPass = $("#user-password").val();
//     //just checking to see that user inputs are captured.
//     console.log(userEmail);
//     console.log(userPass);
//     console.log("Signin function");
//     // Send the POST request.
//     var author = {
//       email: $("#user-email")
//         .val()
//         .trim(),
//       password: $("#user-password")
//         .val()
//         .trim()
//     };

//     $.ajax({
//       type: "POST",
//       data: author,
//       url: "/api/signin"
//     }).then(function(response) {
//       //I AM HAVING ISSUES HERE!!!
//       console.log("Welcome Author");
//       console.log(response);
//       // Reload the page to get the updated list
//       // location.reload();
//       //window.location.href = '/profile-page';
//       if (response) {
//         console.log("Response is true, so redirecting to profile-page....");
//         //Set the sessions storage here
//         // if (sessionStorage) {
//         sessionStorage.setItem("userIdSession", response.id);
//         sessionStorage.setItem("userEmailSession", response.email);
//         // }
//         //clear form
//         console.log(sessionStorage);

//         $("#user-email").val("");
//         $("#user-password").val("");
//         window.location.href = "/profile-page";
//       } else {
//         console.log("Login Incorrect");
//         //clear form
//         location.reload();
//       }
//     });
//   }
//   $("#user-signin").on("click", signin);
//   /*function handleSignin(event) {
//     event.preventDefault();
//     console.log("I am inside handler!");
//   }*/
// });
