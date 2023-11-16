// Importing the Express.js framework 
const express = require('express');
// Create an instance of the Express application called "app"
// app will be used to define routes, handle requests, etc
const app = express();

//Require the querystring middle ware
//Used to convert Javascript into a URL query string
const qs =require('querystring');

// Monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
//useful for troubleshooting 
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
 });

app.use(express.static(__dirname + '/public'));//'express.static(...) this tells the server to use a middleware function that serves static files. 'dirname' is the variable that repreents the directory pathh of the current JS file. This code serves static files and assetts to the web app. Basically generates a GET request to the server and then the server directs asto where the files are. 

// Start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));

/* Import data from a JSON file containing information about products
__dirname represents the directory of the current module (where server.js is located)
__dirname + "./products.json" specifies the location of products.json
*/

//identify that we have an array of products and the information can be found at /products.json. 
const products = require(__dirname + '/products.json');

// Define a route for handling a GET request to a path that matches "./products.js"
//----products.js does not exist. There is a GET request for it and it is handled on the server side. The file is made on the fly and uses the JSON.stringify to send it back to the client side. 
app.get('/products.js', function(request, response, next) {
	// Send the response as JS
	response.type('.js');
	
    //create a JS string (product_str that contains data loaded form the products.json file
    //convert the JS string into a JSON string and embed it within variable products
    let products_str = `let products = ${JSON.stringify(products)};`;
       //Send the string in response to the GET request
        response.send(products_str);
     });


     //this is a middleware function provided by Express.js for handling data that's submitted through HTML forms. It is used to parse and process data that comes from HTML form submissions. This middleware will help your Express application parse and extract data submited on your website, making it accessible for your server-side code to use. 
app.use(express.urlencoded({ extended: true }));

//Add a qty_sold variable for each product. For every item in products as you go through the array add a quantitySold param to that attribute and set intial value to zero. This gets loaded into server memory which is important so the file .json is not overwritten.
for (let i in products) {
    products.forEach((prod, i) => {prod.qty_sold =0});
}

//loop for handling a form submission related to the purchase order on the web app.
//Resond to a POst method to the path /process_purchse (form products_display)
app.post("/process_purchase", function (request, response) {
    //POST content of the request route
    let POST = request.body;

    //Intializa a variable has_qty as false (no quantities intitally)
    //Assume that input boxes are all empty. If nothing is selected, validation will stop there and an error message will ensue. 
    let has_qty = false;

    //Intialize an empty object errObj to store error messages
    let errorObject = {};

    //Creat an object to store error messages
            //let qtys = request.body[`quantity_textbox`];
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
            let qty = POST[`qty${[i]}`];
            
            //update quantity sold and available for the desired product
            products[i].qty_sold += Number(qty);
            products[i].qty_available = products[i].qty_available - qty;
        }
        //redirect to the incvoice page in the URL. The invoice should populate with the valed amounts. 
        response.redirect("./invoice.html?valid&" + qs.stringify(POST));
    }
    //If there is an input error (aside from no inputs)
    else if (Object.keys(errObj).length > 0){
        //redirects user back to products page. if there is more than one error.
        response.redirect("./products_display.html?" + qs.stringify(POST) + `&inputErr`);
    }    
}); 


//server side validation function to check quantity input. // If the purchase is invalid, send the user back to the products display page, provide them with feedback as to why they are enable to proceed to the invoice, and enable them to correct the problem and purchase.
// referenced from Lab 12/ server 6
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
}



