function signin(event){

    // event.preventDefault();
    var userEmail = $('#userName').val();
    var userPass= $('#password').val();
    console.log(userEmail);
    console.log(userPass);
    console.log('Signin function')

    // Send the POST request.
    var author = {
        email: $("#userName").val().trim(),
        password:$("#password").val().trim()
    };

   
    $.ajax({
        type: "POST",
        data: author,
        url:"/api/signin"
      }).then(
        function(response) {
          console.log("Welcome Author");
          console.log(response);
          // Reload the page to get the updated list
            // location.reload();
            // window.location.href = '/signin';

            if (response === true){
                window.location.href = '/signin'; 
            }else{
                console.log("Login Incorrect")
            }

        }
      );
      
    }
$("#signin").on('click', signin);