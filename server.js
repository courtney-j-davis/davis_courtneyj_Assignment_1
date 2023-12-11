//server.js
//From Assignment One. 
const crypto = require('crypto');
const express = require('express');
const app = express();
const qs =require('querystring');
 app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
 });
app.use(express.static(__dirname + '/public'));//'express.static(...) this tells the server to use a middleware function that serves static files. 'dirname' is the variable that repreents the directory pathh of the current JS file. This code serves static files and assetts to the web app. Basically generates a GET request to the server and then the server directs asto where the files are. 
app.listen(8080, () => console.log(`listening on port 8080`));
const products = require(__dirname + '/products.json');
app.get('/products.js', function(request, response, next) {
	response.type('.js');
	let products_str = `let products = ${JSON.stringify(products)};`;
    response.send(products_str);
});
app.use(express.urlencoded({ extended: true }));
// Quantity validation function----------response.redirect(`./login.html?${params.toString()}`);
function validateQuantity(quantity, qty_available) {
    // Check if the quantity is not a number or empty
    if (isNaN(quantity)) {
        return "Not a number. Please enter a non-negative quantity to order.";
    }

    // Check if the quantity is a negative number with decimals
    if (quantity < 0 && !Number.isInteger(quantity)) {
        return "Do not put a negative number to purchase.";
    }

    // Check if the quantity is a negative whole number
    if (quantity < 0) {
        return "Please enter a whole, non-negative number to purchase.";
    }

    // Check if the quantity exceeds the available quantity
    if (quantity > qty_available) {
        return `Look at how many are in stock. There are not ${quantity} available.`;
    }

    // If all checks pass, return an empty string indicating no errors
    return "";
}
// Handling the form submissions
app.post("/process_form", (request, response) => {
    // Extracting quantities from the form data
    const qtys = request.body['quantity_textbox'];

    // Initializing variables to track validity, sold items, and error URL
    let valid = true;
    let url = '';
    const soldArray = [];

    // Loop through each quantity in the form
    for (let i in qtys) {
        // Convert the quantity to a number
        let q = Number(qtys[i]);

        // Call the quantity validation function
        let quantityError = validateQuantity(q, products[i]['qty_available']);

        // Check if the quantity is valid
        if (quantityError === '') {
            // Check if there's enough stock
            if (products[i]['qty_available'] - q < 0) {
                // If not, set validity to false
                valid = false;
            } else {
                // If yes, add to the sold items array
                soldArray[i] = q;
            }
        } else {
            // If the quantity is not valid, set validity to false and update the error URL
            valid = false;
            url += `&prod${i}=${q}`;
        }
    }

    //Check if all quantities are zero, indicating an invalid state
    if (url === `&qty0=0&qty1=0&qty2=0&qty3=0&qty4=0&qty5=0`) {
        valid = false;
    }

    // Redirect based on the outcome
    if (!valid) {
        // Redirect with an error signal and the error URL
        response.redirect(`products_display.html?error=true${url}`);
    } else {
        // Update product data and redirect to the invoice with the sold items
        for ( i in qtys) {
            products[i]['total_sold'] += soldArray[i];
            products[i]['qty_available'] += soldArray[i];
        } }

        response.redirect('login.html?' + url);
        //response.redirect('invoice.html?' + url);
   
});


    



//send the user to the login page and append the quantities they selected

/*Assignment 2*/
//if there are input errors, redirect the user back to product display and display the errors
//response.redirect(`./products_display.html?error`)

//If there are no input errors, redirect the user to the login page instead of the invoice.
//
 /*
    Tis means that the quantities the user selected will have to be stored and sent to every page subsequent of products_display
    Note: before, the inventory and amount sold was calulated here. now, the calculations will only take place after the purchase is made (after the user logs in/registers, or after they logout )AR)
 */

//Assignment 2
//Adding a route to incorporate the the user_data.json file for the process_login
//const user_data_filename = '/user_data.json';



const fs=require ('fs'); //this is from Lab 14
const filename =  'user_data.json';

let user_data;// defining a global variable to store my user data can be used in all the functions and route,

//checking if user_data file exist. and read the content if it does/
if (fs.existsSync(filename)) {
    let data = fs.readFileSync(filename, 'utf-8');
    user_data = JSON.parse(data);
    console.log(user_data);
} else {
    console.log(`${filename} does not exist.`);
    user_data = {};
}

/*const { URLSearchParams } = require('url');
const user_data_filename = '/user_data.json';



//Add a qty_sold variable for each product. For every item in products as you go through the array add a quantitySold param to that attribute and set intial value to zero. This gets loaded into server memory which is important so the file .json is not overwritten.
for (let i in products) {
    products.forEach((prod, i) => {prod.qty_sold =0});
}*/

let temp_user={}; //temporary storage for user inputs to be passed along. the global variable needs to be define to allow this. Its a dummy variable. 



//This is for  the continue shopping function of the app that will redirect user back to products page, taking the URL and tredirecting it back to the products page with the parameters as a string. The quantities and name for personalization should populate. 
app.post ('/continue_shopping', function(request, response){
        let params = new URLSearchParams(temp_user);
        response.redirect(`/products_display.html?${params.toString()}`);
    })
    


// Assignment 2 add
app.post('/purchase_logout', function (request, response) {
    for (let i in products) {
        products[i].qty_sold += Number(temp_user[`qty${i}`]) || 0;
        products[i].qty_available = Number(products[i].qty_available)- Number(temp_user[`qty${i}`]) || 0;
    }

    fs.writeFile(__dirname + '/products.json', JSON.stringify(products), 'utf-8', (err) => {
        if (err) {
            console.error('Error updating products data:', err);
        } else {
            console.log('Products data has been updated');
        }
    })

    // remove user login info from temp_user and go back to products page. 
    delete temp_user['email'];
    delete temp_user['name'];

   response.redirect ('/thanks.html')
})
//loop for handling a form submission related to the purchase order on the web app.
//Respond to a POST method to the path /process_purchase (from products_display)
app.post("/process_purchase", function (request, response) {
    //POST content of the request route
    let POST = request.body;
    let username = request.body[`username`];
    //Initialize a variable has_qty as false (no quantities initially)
    //Assume that input boxes are all empty. If nothing is selected, validation will stop there and an error message will ensue. 
    let has_qty = false;

    //Initialize an empty object errorObject to store error messages
    let errorObject = {};

    for (let i in products) {
        let qty = POST[`qty${[i]}`]; //moved the back ticks from 
        has_qty = has_qty || (qty > 0);

        //Validate using the updated validateQuantity function
        let errorMessages = validateQuantity(qty, products[i].qty_available);
        //Chat's suggestion to fix "errorMessage.join is not a function" error message
        if (!Array.isArray(errorMessages)){
            errorMessages = [errorMessages];
        }

        // Store the error message if there are any actual errors
        if (errorMessages.some(msg => msg.trim() !== "")) {
            // Only add to errorObject if there are actual error messages
            errorObject[`qty${[i]}_error`] = errorMessages.join(', ');
        }

        /*
        //Store the error message if there are any errors
        if (errorMessages.length > 0) {
            errorObject[`qty${[i]}_error`] = errorMessages.join(', ');
        }
        */
    }

    if (Object.keys(errorObject).length === 0) {
        if (has_qty === true) {
            for (let i in products) {
                temp_user[`qty${i}`] = POST[`qty${[i]}`]; //this takes qty i from temp_user and pushes it to the POST or the URL
            }
            //redirect to the login page in the URL. **Changed in Assignment 2 from invoice.html to login.html
            let params = new URLSearchParams(temp_user);
            response.redirect(`./login.html?" + ${params.toString()}`);
        }
        else {
            // No quantities, redirect without appending 'inputErr'
            response.redirect("./products_display.html?" + qs.stringify(POST));
        }
    }
    else {
        console.log(errorObject);
        response.redirect("./products_display.html?" + qs.stringify(POST) + `&inputErr`);
    }

    /*
    //If all input boxes are empty and there are no errors
    // Append error to response URL and send back to products display page
    if (has_qty && Object.keys(errorObject).length == 0) {
        response.redirect("./products_display.html?" +qs.stringify(POST));
    }
    //If there is an input and there are no errors
    else if (has_qty == true && Object.keys(errorObject).length == 0) {
        for (let i in products) {
            temp_user[`qty${i}`] = POST[`qty${[i]}`]; //this takes qty i from temp_user and pushes it to the POST or the URL
        }
        //redirect to the login page in the URL. **Changed in Assignment 2 from invoice.html to login.html
        let params = new URLSearchParams(temp_user);
        response.redirect(`./login.html?" + ${params.toString()}`);
    }
    //If there are errors, redirect user back to products page with error information
    else if (Object.keys(errorObject).length > 0) {
        console.log(errorObject);
        response.redirect("./products_display.html?" + qs.stringify(POST) + `&inputErr`);
    }
    */
});



app.post('/process_login', function (request, response) {
    let POST = request.body;
    let entered_email = POST['email'].toLowerCase();
    let entered_password = POST['password'];
    
//this means the text boxes are blank/
    if (entered_email.length === 0 && entered_password.length === 0) {
        request.query.loginErr = 'Email address & password are both required.';
    }   else if (user_data[entered_email]) {
        if (user_data[entered_email].password === entered_password) {
            //store the user name and email in the cookie. 
            let user_cookie= {"email": entered_email, "name": user_data[entered_email]['name']}
            
            response.cookie('user_cookie', JSON.stringify(user_cookie), (macAge: 900 * 1000));
            console.log(user_cookie);
            
            //Redirect to


            let params = new URLSearchParams(temp_user);
            response.redirect(`/invoice.html?valid&${params.toString()}`);
            return;
        } else if (entered_password === 0) {
            request.query.loginErr = 'Password cannot be blank';
        } else {
            request.query.loginErr = 'Incorrect password';
        }
    } else {
        request.query.loginErr = 'Invalid email';
    }

    request.query.email = entered_email;
    //this puts the enetered email into the URL(params)
    let params = new URLSearchParams(request.query);
    response.redirect(`login.html?${params.toString()}`);

})


 const registration_errors = {};
app.post('/process_register', function (request, response) {
    //get user input
    
    let reg_name =request.body['name'];
    let reg_email = request.body.email.toLowerCase();
    let reg_password = request.body.password;
    let reg_confirm_password = request.body.confirm_password 
//_________________Validations Needed for A2_________________//
    // Validations for registration
    validateEmail(reg_email);
    

    //--------NO ERRORS------------server response..checking if there are no errors. 
    if (Object.keys(registration_errors).length ==0) {
        //make a new object in the user_data object
        user_data[reg_email] = {};
        user_data[reg_email].name = reg_name;
        user_data[reg_email].password = encrypt(reg_password);
        user_data[reg_email].loggedIn= true;

     // Asynchronosuly write the updated user_data and products to their respective files
     fs.writeFile(__dirname + '/user_data.json', JSON.stringify(user_data), 'utf-8', (err)=> {
        if (err) {
            console.error('Error updating user data:', err);
            //consider editing this for my personal preference to where I want to send an error response. 

        } else {
            console.log('User data has been updated!')
        //add the user's info into temp_user
            temp_user['name']= reg_name;
            temp_user['email']= reg_email;
            

        //this makes the current logged in useres sticky
        let params = new URLSearchParams(temp_user);
        response.redirect(`/invoice.html?regSuccess&valid&${params.toString()}`);
        }
    });
    } else //there are errors from validation and stored in registration_errors
    {
        delete request.body.password;
        delete request.body.confirm_password;
//stays the same for A3
        let params = new URLSearchParams(Object.entries(request.body));
        let redirectURL = `/register.html?${params.toString()}&${qs.stringify(registration_errors)}`;

        // Redirect to the constructed URL
        response.redirect(redirectURL);
    }
//-----------EMAIL VALIDATION----------------//
function validateEmail(email) {
    delete registration_errors['email'];

    // Email format requirements
    let emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!emailRegex.test(email)) {
        registration_errors.push("Invalid email format");
    }

    // Check if the email already exists
    const existingEmail = Object.keys(user_data).find(
        (existingEmail) => existingEmail.toLowerCase() === email.toLowerCase()
    );

    if (existingEmail) {
        registration_errors.push(`Email Address ${email} Already Exists!`);
    }
    console.log('Email Exists');
}


//------------NAME VALIDATION---------------//
// display error message when the name is empty
if (request.body.name == "") {
    errors['name'].push('The name is invalid. Please insert a name.');
}
// character limitations (only letters) (ChatGPT)
if (/^[A-Za-z]+ [A-Za-z]+$/.test(request.body.name)) {
} else {  // error message when name doesn't follow character guidelines
    errors['name_format'].push('Please follow the format FirstName LastName!')
}
// the users full name should only allow letters, no more than 30 characters
if (request.body.name.length > 30) { // execute errors if the name surpassed limit
    errors['name'].push('The name is too long. Insert a name less than 30 characters.');
}
// error for when username is already taken
if (typeof users_reg_data[register_user] != 'undefined') { 
    errors['name'].push('Username is taken. Please use a different username.');
}

if (registration_errors.length > 0) {
    // Convert errors to a JSON string
    const errorsJSON = JSON.stringify({ errors: registration_errors });

    // Redirect to the register.html page with errors in the query string
    response.redirect(`/register.html?${errorsJSON}`);
} else {
    // No errors, proceed with registration
    // Your existing registration code...
}
});

//----------password validation--------------//referenced from stack overflow
    function validateConfirmPassword(reg_confirm_password, reg_password) {
        // delete previous errors. 
        delete registration_errors['confirm_password_type'];
        
        console.log(registration_errors);
    
        // Check if the password and repeat password match
        if (reg_password !== reg_confirm_password) {
          registration_errors['confirm_password_type']= 'Password and Repeat Password do not match.'
        } else {
            console.log('Passwords Match!');
       
      }}
      function hashPassword (password) {
        let hash = crypto.createHash ('sha256');
        hash.update(password);
        return hash.digest('hex');
      }
    
    
   app.post('/add_to_cart', function (request, response){








   })
app.post('/update_shopping_cart', function(request, response){
    let POST = request.body;

    let products_key = POST['products_key'];
//looping through the dif product keys and putting into session cart. this resides in the cart. 
    for (products_key in request.session.cart){
        for (let i in request.session.cart[products_key]) {
            request.session.cart[products_key][i] = Number(request.body[`cartInput_${products_key}${i}`]);
        }
    }
    response.redirect('/cart.html');
})
 //This is used to cliccking on logout but then change mind go to products page.  
app.post('/continue', function(request, response){
    response.redirect(`/products.html?`);
})

app.post(`/checkout`, function(request, response){
    if (typeof request.cookies['user_cookie']== 'undefined') {
        response.redirect(`/login.html?`)
    } else {
        response.redirect(`/invoice.html?valid`);
    }
})


   // If the passwords match, you can proceed with form submission or other actions

   //document.getElementById('register-form').submit();
   //update the total sold and quantity avalible 
app.post("/complete_purchase", function (request, response) {
    let orderParams = request.body['order'];
    let orderArray = JSON.parse(orderParams);
    let username = request.body['name'];
    for (i in orderArray)
        {
            //update total and qty only if everything is good
            products[i]['total_sold'] += orderArray[i];
            products[i]['qty_available'] -= orderArray[i];
        }
        //log out user
        loginUsers.pop(reg_name);
        console.log(loginUsers);
    response.redirect('/products_display.html?&thankYou=true');
})

app.post('/process_logout', function (request, response){
        let cookie = JSON.parse(request.cookies['user_cookie']);

        let email = cookie['email'];

        if (user_data [email]&& user_data[email].status == true) {
            //remove user status------need to put div in HTML for user status
            delete status[email];

            user_data[email].status = false

            response.clearCookie("user_cookie");

            request.session.users = Object.keys(status.length);

            fs.writeFile(filename, JSON.stringify(user_data), 'utf-8', (err) => {
                if (err) {
                    console.error('Error updating user data:', err);
                } else{
                    console.log///follow up with the rest of the code. 
                }
            })
        }

    
})