//server.js
//From Assignment One. 
const crypto = require('crypto');
const express = require('express');
const app = express();

/*this is middleware added to this assignment to handle cookies and session ID
myNotSoSecretKey it ensures that the session data, which may include sensitive information like the user's shopping cart contents and personal details, is securely signed.
resave true this ensures that any changes made to the user's cart during their session are saved.
saveUnintialized true useful to store a new user's empty shopping cart.  */

const session = require('express-session');
app.use(session({secret: "myNotSoSecretKey", resave : true, saveUninitialized: true}));

/*the cookie-parser middleware is an essential component for handling cookies, 
 manages user sessions, authentication, and storing user-specific information. 
 It facilitates the parsing of incoming cookies, making it easier for my Express.js application to interact with and utilize
the data stored in these cookies, which is often critical for a seamless and personalized user experience in an e-commerce context*/

const cookieParser = require('cookie-parser');
const {request} = require('http');
app.use(cookieParser());



const qs =require('querystring');
//keeping this to track erros. 

 
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    //checks to see if the shopping cart is empty if it is an empty object is intialized
    if (typeof request.session.cart == 'undefined') {
        request.session.cart = {};
    }
    /*This checks if the 'users' property is undefined in the session.
    //make a user session needs to be added. 
//******I need to define 'staus' somewhere in this app 
    if (typeof request.session.users == 'undefined') {
        request.session.users = Object.keys(status).length;
    }*/
    
    
    next();
 });


app.use(express.static(__dirname + '/public'));//'express.static(...) this tells the server to use a middleware function that serves static files. 'dirname' is the variable that repreents the directory pathh of the current JS file. This code serves static files and assetts to the web app. Basically generates a GET request to the server and then the server directs asto where the files are. 
app.listen(8080, () => console.log(`listening on port 8080`));


// after you pull in info from json, loop through each product.
const products = require(__dirname + '/products.json');
for (let category in products) {
    //Create a qty_sold key for each product
    //I might not need this since I already put this in my json  file by hand.
    products[category].forEach((prod, i) => {prod.qty_sold = 0});

}

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



    
const fs=require ('fs'); //this is from Lab 14
const filename =  'user_data.json';


let status = {}; //sotre use datab
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

app.post('/get_cart',function (request, response){
    response.json(request.session.cart);
})
//add something to do with get status###########
let temp_user ={};

app.post('/process_login', function (request, response) {


    let POST = request.body;
    let entered_email = POST['email'].toLowerCase();
    let entered_password = POST['password'];
    
//this means the text boxes are blank/
    if (entered_email.length === 0 && entered_password.length === 0) {
        request.query.loginErr = 'Email address & password are both required.';
    }   
    else if (user_data[entered_email]) {
        //if stored encrypted password matches with the encrptd inputted password
        
        if (user_data[entered_email].password === entered_password) {
            if (user_data[entered_email].status == false) {
                user_data[entered_email].status == true;
            }
//store the user name and email in the cookie. 
        let user_cookie= {"email": entered_email, "name": user_data[entered_email]['name']};
     
//response with the user's cookie as a JSON string adn set expiration to 15 minutes

        response.cookie('user_cookie', JSON.stringify(user_cookie), {maxAge:900 * 1000});
        console.log(user_cookie);
 //**??--------below code could possible be used for the footer user count */       
        /*request.session.users = Object.keys(status).length;
        console.log(`Current users: ${Object.keys(status).length} - ${Object.keys(status)}`);*/

        // Asynchronously write the updated user_data and products to their respective files
        fs.writeFile(__dirname + filename, JSON.stringify(user_data), 'utf-8', (err)=> {
            if (err) throw err;
            console.log('User data has been updated!');
        });

        //redirect to cart; thee user's selected quantities os stored in the session cart
        response.redirect(`/cart.html?`);
        return;
    }
    else if (entered_password === 0) {
            request.query.loginErr = 'Password cannot be blank';
        } 
        else {
            request.query.loginErr = 'Incorrect password';
        }
    } 
    else {
        request.query.loginErr = 'Invalid email';
    }

    request.query.email = entered_email;
    //this puts the enetered email into the URL(params)
    let params = new URLSearchParams(request.query);
    response.redirect(`login.html?${params.toString()}`);

});


//modify for cookies
 const registration_errors = {};
app.post('/process_register', function (request, response) {
    //get user input
    
    let reg_name =request.body.name;
    let reg_email = request.body.email.toLowerCase();
    let reg_password = request.body.password;
    let reg_confirm_password = request.body.confirm_password 


    validateConfirmPassword (reg_confirm_password, reg_password); 
    //--------NO ERRORS------------server response..checking if there are no errors. 
    if (Object.keys(registration_errors).length ==0) {
        //make a new object in the user_data object
       user_data[reg_email] = {
        "name": reg_name,
        "password": reg_password,
        "status": true
       };
    
       // Asynchronosuly write the updated user_data and products to their respective files
     fs.writeFile(__dirname + '/user_data.json', JSON.stringify(user_data), 'utf-8', (err)=> {
        if (err) {
            console.error('Error updating user data:', err);
            //consider editing this for my personal preference to where I want to send an error response. 

        } else {
            console.log('User data has been updated!');

            status[reg_email]=true;

            response.redirect(`/login.html`);
        }
    });
} 
else //there are errors from validation and stored in registration_errors
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

    let POST = request.body;
//create an empty error object
    let errorObject = {};

    for (let i in products[products_key]) {
//loop through the product key and update the quantites
        let errorMessages =validateQuantity(qty, products[products_key][i].qty_available);
        if (errorMessages.length >0) {

            errorObject[`qty${[i]}_error`] =errorMessages.join(', ');
        }
        console.log('error messages are: + errorMessages');
    }
// just to see what errors I have
    console.log("errorObject = "+Object.keys(errorObject)+ " " +Object.keys(errorObject).length);
    //If there are no errors
    if (Object.keys(errorObject).length == 0) {
        if (!request.session.cart) {
            //Create a session
            request.session.cart = {};
        }
        //it the session cart array for a product category does not exist, just make sure there isn't an error in the program if there is an undefined

        if (typeof request.session.cart[products_key]== 'undefined') {
            //Create a session cart array
            request.session.cart[products_key] = [];
        }
        //make an array to store the quantitiers the users input
        let user_qty = [];

        for (let i in products[products_key]) {
            //push the user input into the array
            user_qty.push(Number(POST[`qty${i}`]));
        }
        request.session.cart[product_key]= user_qty;
        response.redirect(`/products.html?products_key=${POST['products_key']}`);

    }
    //if there is an error
    else if (Object.keys(errorObject).length > 0) {
        response.redirect(`/products.html?products_key=${qs.stringify(POST)}&inputErr`);
    } 
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