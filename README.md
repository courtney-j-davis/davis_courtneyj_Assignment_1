# davis_courtneyj_Assignment_1
Design an e-commerce website that will display at least 5 different products or services to the user, 
from which they can choose multiple quantities of any combination of the products or services. 
Perform a check to make sure that the user has entered valid quantities and to then calculate the sales total, including tax and shipping/handling costs.

Main requirements:

Use arrays (of objects) to display items and quantities available
Use forms to process information on a server
Allow users to select and process multiple products/services

Create a JSON file (products.json). In the file, create an array of objects. 
--Each object represents each of your products and include the relevant details for the product, 
-------such as name, price, description, etc. 
-------include an attribute indicating the inventory amount for each product (qty_available).

Create a server named server.js. 
  includes serving your products data, 
  displaying the products page, 
  validating purchase data, 
  providing an invoice for a purchase. 

HTML files and images MUST live in a folder called public in assignment directory

Load products.json file into server.js.


Make client pages: 
  -products_display.html
  -invoice.html, 
  -products_display.js
  -index.html  :  to serve as your home page.
  -
  
  Get the product information dynamically with a GET request for products.js from the server with the following:
  Remember to load the product information in the head of your products_display file.
          <script type="text/javascript" src="./products.js"></script>

Create a loop that loops through the array with either for(), while(), or forEach() to display the information about the items.
This is where bootstrap input should be placed to format the products. 
Use a loop to display your products. Display the information for each product (name, price, image, qty_available, etc). 



Create a Navigation Bar: Provide a way for users to traverse from the home page to the products display page.
-

Create an HTML form to ask customers which items they wish to purchase and use the POST method with action ./purchase to request that the server process the form data.
-
  The form displayed will allow customers to select the item that they want and the quantity they want in an <input type=”text”> with no HTML validations or other client side data guards. 
  
Create a submit button on this form.
-

Create display error messages to direct customers to enter valid data.
-

Server-side data validation
-
If the purchase is invalid, send the user back to the products display page, 
provide them with feedback as to why they are enable to proceed to the invoice, 
enable them to correct the problem and purchase.

-----There are 3 things to check to validate a purchase:
-

      No quantities were selected (i.e all quantities are 0)
      A non-negative integer is input as a quantity (i.e a letter character, a negative integer, a non-integer)
      A quantity input exceeds the quantity available for that product
      
Update Inventory
-
Once the customer has entered valid data on the server, update the inventory (qty_available) for the product(s) purchased and display the purchase information in an invoice.

Include tax and shipping if necessary and specify that the tax and/or shipping are unique to the order (Don’t just use a fixed shipping cost for any purchase). 
All outputs should be properly formatted (e.g monetary amounts should have 2 decimal points and a dollar sign).

Description of AR's:
-
  AR1: 
    Check that a quantity entered is valid (see conditions given in the instructions above). 
    If not, change the frame for the textbox to red and display a message with what’s wrong near the input e.g. “Quantity must be a number!”. 
    If the input is valid, indicate this with a message like “You want:”. 
    Do not add a guard or HTML validation that would prevent the user from entering an invalid quantity. 
    You do not need to do this on the server. But consider the quantity available when there are multiple users purchasing. This is a.k.a. IR2.
    
  AR2: 
    When displaying the invoice, add a small icon image of the product to the line item. 
    If the user hovers over the icon, have a popup window appear with a product description. This is a.k.a. IR5.
    
  AR3:  
    Track the total quantity of each item sold. 
    This needs to be implemented on the server when you remove sold items from the quantity available. 
    Display total quantity sold with the product information. 
    Extra extra credit: have this dynamically update on the client when there are any purchases processed on the server (from other users). This is a.k.a. IR1.
    
  AR4: 
    Check that the quantity entered does not exceed the quantity available as currently available on the server. 
    If it does, change the frame for the textbox to red and display a message “We don’t have xx available.” and reduce the input to the quantity available (replace the input). 
    The primary intent of this requirement is to let the user know that the amount they wanted when they try to purchase was no longer available if another user purchased before them. 
    This means you must do this in a response from the server since it is the only place that has the current number available (consider the quantity available when there are multiple users purchasing). 
    You do not need to do this on the server in response to a purchase, but this is probably the more straightforward way. 
    If you only check the quantity available on the current page when the user enters it in the textbox, it will not prevent the quantity being unavailable on the server due to another users purchase. 
    Extra extra credit: check if the quantity is available on the server and update the quantity available as the user enters the quantity in the textbox. That is, not in response to a purchase. This is a.k.a. IR3.







