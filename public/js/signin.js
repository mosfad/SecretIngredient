$(document).ready(function() {
function signin(event){

  event.preventDefault();
  var userEmail = $('#user-email').val();
  var userPass= $('#user-password').val();
  //just checking to see that user inputs are captured.
  console.log(userEmail);
  console.log(userPass);
  console.log('Signin function');

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

          if (response){
              console.log("Response is true, so redirecting to profile-page....");
              //Set the sessions storage here
              if (sessionStorage) {
                  sessionStorage.setItem("userIdSession", response.id);
                  sessionStorage.setItem("userEmailSession", response.email);
              }
              //clear form
              $("#user-email").val("");
              $("#user-password").val("");
              window.location.href = "/profile-page"; 
          }else{
              console.log("Login Incorrect")
              //clear form
              location.reload();
          }

      }
    );
    
  }
$("#user-signin").on("click", signin);
/*function handleSignin(event) {
  event.preventDefault();
  console.log("I am inside handler!");
}*/
})