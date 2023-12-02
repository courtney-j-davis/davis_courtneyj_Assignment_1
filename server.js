//From Assignment One. 
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

function validateQuantity(quantity, availableQuantity) {
    let errors = [];
    
    //convert quantity to a number becasue the auanity was probably brought in as a string. 
    quantity = Number(quantity); 

    switch (true) {
        case isNaN(quantity) || quantity === '':
            errors.push("Not a number. Please enter a non-negative quantity to order.");
            break;
        case quantity < 0 && !Number.isInteger(quantity):
            errors.push("Do not put a negitive number to purchase.");
            break;
        case quantity < 0:
            errors.push("Please enter a whole, non-negative number to purchase.");
            break;
        case quantity > availableQuantity:
            errors.push (`Look at how many are in stock. There are not ${quantity}available.`);
            break;
     }
    
    return errors;

//send the user to the login page and append the quantities they selected

/*Assignment 2*/
//if there are input errors, redirect the user back to product display and display the errors
//response.redirect(`./products_display.html?error`)

//If there are no input errors, redirect the user to the login page instead of the invoice.
//response.redirect(`./login.html?${params.toString()}`);
 };
/*
    Tis means that the quantities the user selected will have to be stored and sent to every page subsequent of products_display
    Note: before, the inventory and amount sold was calulated here. now, the calculations will only take place after the purchase is made (after the user logs in/registers, or after they logout )AR)
 */
//Assignment 2 add

let user_data;// defining a global variable to store my user data can be used in all the functions and route,
const fs=require ('fs'); //this is from Lab 14
const { URLSearchParams } = require('url');
const filename= __dirname + '/user_data.json';
if(fs.existsSync(filename)){
    let data =fs.readFileSync(filename, 'utf-8');
    user_data =JSON.parse(data);
    console.log(user_data);
}else {
    console.log(`${filename}does not exist.`);
    user_data={};
};




//Add a qty_sold variable for each product. For every item in products as you go through the array add a quantitySold param to that attribute and set intial value to zero. This gets loaded into server memory which is important so the file .json is not overwritten.
for (let i in products) {
    products.forEach((prod, i) => {prod.qty_sold =0});
}

let temp_user={}; //temporary storage for user inputs to be passed along. the global variable needs to be define to allow this. Its a dummy variable. 


//loop for handling a form submission related to the purchase order on the web app.
//Resond to a POst method to the path /process_purchse (form products_display)
app.post("/process_purchase", function (request, response) {
    //POST content of the request route
    let POST = request.body;

//This is for  the continue shopping function of the app that will redirect user back to products page, taking the URL and tredirecting it back to the products page with the parameters as a string. The quantities and name for personalization should populate. 
app.post ('/continue_shopping', function(request, response){
        let params = new URLSearchParams(temp_user);
        response.redirect(`/products_display.html?${params.toString()}`);
    })
    


// Assignment 2 add
app.post('/purchase_logout', function (request, response) {
    for (let i in products) {
        products[i].qty_sold += Number(temp_user[`qty${i}`]);
        products[i].qty_available = products[i].qty_available - Number(temp_user[`qty${i}`]);
    }

    fs.writeFile(__dirname + '/products.json', JSON.stringify(products), 'utf-8', (err) => {
        if (err) {
            console.error('Error updating products data:', err);
        } else {
            console.log('Products data has been updated');
        }
    });

    // remove user login info from temp_user and go back to products page. 
    delete temp_user['email'];
    delete temp_user['name'];

    response.redirect('/products_display.html');
});




    //Intializa a variable has_qty as false (no quantities intitally)
    //Assume that input boxes are all empty. If nothing is selected, validation will stop there and an error message will ensue. 
    let has_qty = false;

    //Intialize an empty object errObj to store error messages
    let errorObject = {};

    //Creat an object to store error messages
            let qtys = request.body[`quantity_textbox`];
    for (let i in products){
        let qty = POST[`qty${[i]}`]
        has_qty =has_qty || (qty >0);

        //Validate using the updated valedatQuantity function
        let errorMessages = validateQuantity(qty, products [i].qty_availabl);

        //Store the erro message if there are any errors
        if (errorMessages.length > 0){
            error.Object[`qty${[i]}_error`] =errorMessages.join(', ');
        }
    }

//If all input boxes are empty and there are no errors
// Append error to response URL and send back to procucts dispaly page
if (has_qty == false && Object.keys(errorObject).length ==0 ) {
    response.redirect("./products_display.html?");
    }
//If there is an input and there are no errors
    else if (has_qty == true && Object.keys(errorObject).length == 0) {
        for (let i in products) {
            temp_user[`qty${i}`] = POST[`qty${[i]}`];//this takes qty i from temp_user and pushes it to the POST or the URL
         }
        //redirect to the login page in the URL. **Changed in Assignment 2 from invoice.html to login.html
        let params = new URLSearchParams(temp_user) 
        response.redirect(`./login.html?" + ${params.toString()}`);
        }
    else if (Object.keys(errObj).length > 0){
        //redirects user back to products page. if there is more than one error.
        response.redirect("./products_display.html?" + qs.stringify(POST) + `&inputErr`);
    };


//server side validation function to check quantity input. // If the purchase is invalid, send the user back to the products display page, provide them with feedback as to why they are enable to proceed to the invoice, and enable them to correct the problem and purchase.
// referenced from Lab 12/ server 6
//Use this in Assignment 2


//Assignment 2
//Adding a route to incorporate the the user_data.json file for the process_login
const user_data_filename = '/user_data.json';
let user_data;

if (fs.existsSync(user_data_filename)) {
    let data = fs.readFileSync(user_data_filename, 'utf-8');
    user_data = JSON.parse(data);
    console.log(user_data);
} else {
    console.log(`${user_data_filename} does not exist.`);
    user_data = {};
}



app.post('/process_login', function (request, response) {
    let POST = request.body;
    let entered_email = POST['email'].toLowerCase();
    let entered_password = POST['password'];

    if (entered_email.length === 0 && entered_password === 0) {
        request.query.loginErr = 'Email address & password are both required.';
    } else if (user_data[entered_email]) {
        if (user_data[entered_email].password === entered_password) {
            temp_user['email'] = entered_email;
            temp_user['name'] = user_data[entered_email].name;

            console.log(temp_user);

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
    let params = new URLSearchParams(request.query);
    response.redirect(`login.html?${params.toString()}`);
})})

let registration_errors = {};

app.post('/process_register', function (request, response){
    //get user input
    let reg_name =request.body.name;
    let reg_email = request.body.email.toLowerCase();
    let reg_psw = request.body.password;
    let reg_confirm_psw = request.body.confirm_password 

    //email validation
    //name validation
    //password validation
    
    
    //make sure passwords match
    validateConfirmPassword(reg_confirm_psw, reg_psw); 

    //server response..checking if there are no errors. 
    if (Object.keys(regitration_errors).length ==0) {
        //make a new object in the user_data object
        user_data[reg_email] = {};
        user_data[reg_email].name = reg_name;
        user_data[reg_email].password = reg_psw;

     // Asynchronosuly write the updated user_data and products to their respective files
     fs.writeFile(__dirname + '/user_data.json', JSON.stringify(user_data), 'utf-8', (err)=> 
        {
        if (err) {
            console.error('Error updating usere data:', err);
            //consider editing this for my personal preference to where I want to send an error response. 

        } else {
            console.log('User data has been updated!')
        //add the user's info into temp_infor
            temp_user['name']= reg_name;
            temp_user['email']= reg_email;

        console.log(temp_user);
        console.log(user_data);
        
        let params = new URLSearchParams(temp_user);
        response.redirect(`/invoice.html?regSuccess&vallid&${params.toString()}`);
        } 
        });
    } else //there are errors from vallidation and stored in registration_errors
    {
        delete request.body.password;
        delete request.body.confirm_password;

        let params = new URLSearchParams(request.body);
        response.redirect(`/register.html?${params.String()& $(qs.stringify(regitration_errors))}`);
    }
    
  
  })

  function validateConfirmPassword(reg_confirm_psw, reg_psw); {
    // delete previous errors. 
    delete registration_errors['confirm_password_type'];
    
    console.log(registration_errors);

    // Check if the password and repeat password match
    if (reg_psw !== reg_confirm_psw) {
      registration_errors['confirm_password_type']= 'Password and Repeat Password do not match.';
    }
  
   
  }

   // If the passwords match, you can proceed with form submission or other actions
   //document.getElementById('register-form').submit();