// Populate the DOM Form with the product details
for (let i in products[products_key]) {
    // Create a product card for each product
    document.querySelector('.row').innerHTML += `
    <div class="col-md-6 product_card" style="margin-bottom: 40px; padding: 15px;">
    <div>
    <h5  class="product_name">${products[products_key][i].Make}<br>${products[products_key][i].Model}<br>${products[products_key][i].Year}</h5>
    
</div>  
<img src="${products[products_key][i].Image}" class="img">
<div style="height: 90px;">
    <table style="width: 100%; text-align: center; font-size: 18px;" id="product_table">
        <tr>
            
            
            <td style="text-align: center; width: 35%;" rowspan="2"></td>
            <div style="border-radius: 20px; border: 2px solid black; width: 70%; height: 40px; float: right;">
                <button type="button" class="qtyButton highlight" onclick="document.getElementById('qty${[i]}_entered').value--; checkInputTextbox(qty${[i]}_entered);">--</button>

                <input type="text" autocomplete="off" placeholder="0" name="qty${[i]}" id="qty${[i]}_entered" class="inputBox" onkeyup= "checkInputTextbox(this)">

                <button type="button" class="qtyButton highlight" onclick="document.getElementById('qty${[i]}_entered').value++; checkInputTextbox(qty${[i]}_entered);">+</button>
        </div>

                <label id="qty${[i]}_label" style="margin: 6px 0; float: right; padding-right: 10px;">Qty:</label>
            </td>
       
        
        <tr>
            <td colspan="3" style="padding-top: 5px;"><div id="qty${[i]}_error" style="color: red;"></div></td>
        </tr>
        <br>
        <br>
        <h1 class="product_price">$${Number(products[products_key][i].Price).toFixed(2)}</h1>
    </table>
</div>  
</div>
`;
}

// PERFORM CLIENT-SIDE DATA VALIDATION

// Updated validateQuantity function
function validateQuantity(quantity, qty_available) {
    let errors = []; // Initialize an array to hold error messages

    quantity=Number(quantity);

    switch (true) {
        case (isNaN(quantity)) && (quantity != ''):
            errors.push("Not a number. Please enter a non-negative quantity to order.");
            break;
        case quantity < 0 && !Number.isInteger(quantity):
            errors.push("Negative inventory and not an Integer. Please enter a non-negative quantity to order.");
            break;
        case quantity < 0:
            errors.push("Negative inventory. Please enter a non-negative quantity to order.");
            break;
        case quantity !=0 && !Number.isInteger(quantity):
            errors.push("Not an Integer. Please enter a non-negative quantity to order.");
            break;
        case quantity > qty_available:
            errors.push(`We do not have ${quantity} available.`);
            break;
        // No default case needed as no errors means the array remains empty
    }

    return errors; // Return the array of errors
};


// CHECK INPUT BOXES AGAINST DATA VALIDATION FUNCTION
// Remove leading 0's
// Updated checkInputTextbox function
function checkInputTextbox(textBox, qty_available) {
    let str = String(textBox.value);

    // Check if the first character is '0' and remove it if found
    if (str.charAt(0) == '0') {
        textBox.value = Number(str.slice(0, 0) + str.slice(1, str.length));
    }

    // Convert the input value to a number
    let inputValue = Number(textBox.value);

    // Validate the user input quantity using the updated validateQuantity function
    let errorMessages = validateQuantity(inputValue, qty_available);

    // Check if there are any error messages and update the display
    let errorDisplay = document.getElementById(textBox.name + '_error');
    if (errorMessages.length > 0) {
        errorDisplay.innerHTML = errorMessages.join('<br>');
        errorDisplay.style.color = "red";
        textBox.parentElement.style.borderColor = "red";
    } else {
        errorDisplay.innerHTML = "";
        textBox.parentElement.style.borderColor = "black";
    }
}



window.onload = function() {
    /* If there is a server side validation error
    Display message to user and allow them to edit their inputs
    User input is made sticky by retrieving quantities from the URL 
    Those inputs are validated by isNonNegInt again */

    if (params.has('error')) {
       
        document.getElementById('errMsg').innerHTML = "No quantities selected.";
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 2000);
    } 
    else if (params.has('inputErr')) {
        document.getElementById('errMsg').innerHTML = "Please fix errors before proceeding.";
        setTimeout(() => {
            document.getElementById('errMsg').innerHTML = "";
        }, 2000);

        for (let i in products) {
            let qtyInput = qty_form[`qty${[i]}_entered`];
            let qtyError = document.getElementById(`qty${[i]}_error`);

            // Set the value from URL parameters
            if (params.get(`qty${i}`) !== null) {
                qtyInput.value = params.get(`qty${i}`);
            }

            // Validate the quantity and display errors
            let errorMessages = validateQuantity(qtyInput.value, products[i].qty_available);
            if (errorMessages.length > 0) {
                qtyError.innerHTML = errorMessages.join('<br>');
                qtyInput.parentElement.style.borderColor = "red";
            } else {
                qtyError.innerHTML = "";
                qtyInput.parentElement.style.borderColor = "black";
            }
        }
    }
    //making the input sticy using the cookie
    for (let i in products) {
        // Assuming products[i] represents a product object
        let products_key = products[i].products_key;
    
        if ((typeof shopping_cart[products_key] !== 'undefined') && (params.has('inputErr') !== true)) {
            for (let i in shopping_cart[products_key]) {
                if (shopping_cart[products_key][j] == 0) {
                    document.getElementById(`qty${[j]}`).value = '';
                } else {
                    document.getElementById(`qty${[j]}`).value = shopping_cart[products_key][j];
                }
            }
        }
    }
    
    


    if (params.has('name')) {
        document.getElementById('helloMsg').innerHTML = `Mahalo, ${name}!`
        for (let i in products){
            qty_form[`qty${i}`].value =params.get(`qty${i}`);
        }
        document.getElementById("login_status").innerHtml = login_user.length;
    }
}