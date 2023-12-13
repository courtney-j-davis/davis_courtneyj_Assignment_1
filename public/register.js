/* register.js
---------This is Sal's code for A3--------------------
let params = (new URL(document.location)).searchParams;

// When the window loads, perfom the following function:
window.onload = function() {
    let register_form = document.forms['register_form'];

    // Get the values previously inputted and place them back into the input boxes
    register_form.elements['name'].value = params.get('name');
    register_form.elements['email'].value = params.get('email');

    // Get the error messages and display them accordingly
    for (let i = 0; i <= document.getElementsByClassName('form-group').length; i++) {
        let inputName = register_form.elements[i].name;

        if (params.has(`${inputName}_length`)) {
            document.getElementById(`${inputName}_error`).innerHTML = params.get(`${inputName}_length`);

            if (params.has(`${inputName}_type`)) {
                document.getElementById(`${inputName}_error`).innerHTML = params.get(`${inputName}_length`) + `<br>` + params.get(`${inputName}_type`);
            }
        } 
        else if (params.has(`${inputName}_type`)) {
            document.getElementById(`${inputName}_error`).innerHTML = params.get(`${inputName}_type`);
        }
    }            
}

*/

//-------MY Code from A2- probably need to come back and revise-------------//
window.onload = function(){
let params= (new URL (document.location)).searchParams;
let register_form = document.forms['register_form'];

    //get the values from the login URL and place in register form. Sticky part
    //register_form.elements['name'].value = params.get('name'); 
    //register_form.elements['email'].value = params.get('email'); 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    //set sticky values for name, username, and email
    const stickyName = urlParams.get('StickyName');
    const stickyUsername = urlParams.get('StickyUsername');
    const stickyEmail = urlParams.get('StickyEmail');
    
    if (stickyName) {
        document.getElementById('name').value = stickyName;
    }
    if (stickyUsername) {
        document.getElementById('username').value = stickyUsername;
    }
    if (stickyEmail) {
        document.getElementById('email').value = stickyEmail;
    }        
}
    
/*---------------------------Password Validation---------------------------------
use function validatePassword
validateConfirmPassword
encrypt
*/
// Referenced from W3 schools
function validatePassword() {
  // Get entered values for password
  // let password = document.forms ['registration_form']['password'].value;

  // validate password requirements and complexity,
  let myInput = document.getElementById("password");
  let letter = document.getElementById("letter");
  let capital = document.getElementById("capital");
  let number = document.getElementById("number");
  let length = document.getElementById("length");

  // When the user clicks on the password field, show the message box
  myInput.onfocus = function () {
    document.getElementById("message").style.display = "block";
  }

  // When the user clicks outside of the password field, hide the message box
  myInput.onblur = function () {
    document.getElementById("message").style.display = "none";
  }

  // When the user starts to type something inside the password field
  myInput.onkeyup = function () {
    // Validate lowercase letters
    let lowerCaseLetters = /[a-z]/g;
    if (myInput.value.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate capital letters
    let upperCaseLetters = /[A-Z]/g;
    if (myInput.value.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    let numbers = /[0-9]/g;
    if (myInput.value.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    // Validate length
    if (myInput.value.length >= 12) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
  }
}

window.onload = function () {
  let register_form = document.forms['register-form'];

  // get the values from the login URL and place in register form. Sticky part
  register_form.elements['name'].value = params.get('reg_name');
  register_form.elements['email'].value = params.get('email');

  // get error messages
  if (params.has('errors_obj')) {
    // convert string to json string to object
    let errors = JSON.parse(params.get('errors_obj'));
    for (let err in errors) {
      // put the error messages in the div for the element where the error occurred
      document.getElementById(`${err}_errors`).innerHTML = errors[err].join('<br>');
      // put value back in textbox (make sticky)
      document.getElementById(err).value = params.get(err);
    }
  }
}

// Handle name validation errors
if (params.has('errors')) {
  let nameErrors = JSON.parse(params.get('errors')).name;
  if (nameErrors && nameErrors.length > 0) {
    // Display name errors in the appropriate div
    document.getElementById('errors_name').innerHTML = nameErrors.join('<br>');
  }
}
