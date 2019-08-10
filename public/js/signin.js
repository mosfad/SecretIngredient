$(document).ready(function() {
function signin(event){

  // event.preventDefault();
  var userEmail = $('#user-email').val();
  var userPass= $('#user-password').val();
  //just checking to see that user inputs are captured.
  console.log(userEmail);
  console.log(userPass);
  console.log('Signin function')

  // Send the POST request.
  var author = {
      email: $("#user-email").val().trim(),
      password:$("#user-password").val().trim()
  };

 
  $.ajax({
      type: "POST",
      data: author,
      url:"/api/signin"
    }).then(
      function(response) {
        //I AM HAVING ISSUES HERE!!!
        console.log("Welcome Author");
        console.log(response);
        // Reload the page to get the updated list
          // location.reload();
          //window.location.href = '/profile-page';

          if (response === true){
              console.log("Response is true, so redirecting to profile-page....");
              window.location.href = "/profile-page"; 
          }else{
              console.log("Login Incorrect")
          }

      }
    );
    
  }
$("#user-signin").on('click', signin);
})