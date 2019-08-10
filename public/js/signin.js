function signin(event) {
  console.log("Signin function");
  // Send the POST request.
  var newAuthor = {
    email: $("#user-email")
      .val()
      .trim(),
    password: $("#user-password")
      .val()
      .trim()
  };

  $.ajax("/api/signin", {
    type: "POST",
    data: newAuthor
  }).then(function(response) {
    console.log("Welcome Author");
    console.log(response);
    // Reload the page to get the updated list
    // location.reload();
    //window.location.href = '/profile-page';

    if (response !== null) {
      console.log("Response is true, so redirecting to profile-page....");
      window.location.href = "/profile-page";
    } else {
      console.log("Login Incorrect");
      alert("Incorrect email or password");
    }
  });
}
$("#user-signin").on("click", signin);
