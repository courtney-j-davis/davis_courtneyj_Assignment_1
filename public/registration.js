/* 
Validation of Regitration Information
Name:
    use function validateName 
        (make sure its letters not numbers)
        make sure users have a first and last name
Password:
    use function validatePassword
                validateConfirmPassword
                encrypt
    password requirements and complexity:
        at least 12 characters long
        require a special character
        require number
    once password and username is created and encrypted puch to server.js
Email:
     validateEmail
Address:
    use function isNonNegInt
Get the values previously inputted and place them back into the input boxxes
Get the error messages and display them accordingly








*/
let params= (new URL (document.location)).searchParams;

window.onload = function(){
    let registers
}
