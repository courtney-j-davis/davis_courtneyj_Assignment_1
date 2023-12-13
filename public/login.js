//Sal's code

// When the window loads, perfom the following function:
window.onload = function() {
    //read in the URL redirect, if there is one
    let params = (new URL(document.location)).searchParams;
    // If the key 'loginError' is present, it means that there were no inputs or an invalid email/password
    if (params.has('loginErr')) {
        // After the window loads, get the value from key 'loginError' and display it in errorMessage
        document.getElementById('errMsg').innerHTML = params.get('loginErr')
    }
    document.getElementById('email').value = params.get('email');


    
}
/*
//my code from A2 which may not work, coming back to this 
let params = new URLSearchParams(window.location.search);

window.onload = function () {
    // Check if there is a login error
    if (params.has('loginErr')) {
        // Display the login error message
        document.getElementById('errMsg').innerHTML = params.get('loginErr');
    }
   
    document.getElementById('email').value = params.get('email');
    // Check if there is a valid parameter indicating a successful login
    if (params.has('valid')) {
        // Get user information from URL parameters
        let userEmail = params.get('email');
        let userName = params.get('name');

        // Display a welcome message
        document.getElementById('helloMsg').innerHTML = `Welcome, ${'name'}!`;

        // Perform additional actions for a successful login
        

        // Optional: Redirect to another page or perform other actions
        // window.location.href = '/dashboard.html'; // Example redirect
    }

    // Populate the email field if available
    document.getElementById('email').value = params.get('email');
};*/

//-----function to show password while typing. Referenced from w3 schools
function showPassword () {
    let x = document.getElementById("myInput");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

