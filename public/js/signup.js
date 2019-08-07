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

    username = $("#username").val().trim();
  password = $("#password").val().trim();
  contact = $("#contact").val().trim();
  destination = $("#destination").val().trim();

  submitform();
});

// Force the user to input their information.
function submitform() {
  if (username === "" || password === "" || contact === "" || destination === "") {
    $('#formModal').modal('show');
  }
  else {
    signup();


    // Clear form after submitting 
    $("#username").val("");
    $("#contact").val("");
    $("#destination").val("");
    $("#login").hide();
  }
}

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