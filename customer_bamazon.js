//Connect to MySQL Bamazon

// Pull in required dependencies
var mysql = require("mysql");
let inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "gengar1085@",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to BAMAZON, shopper # " + connection.threadId + "\n");
    displayInventory();
})

// ================================================================================================================================================================
// displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {

    queryStr = 'SELECT * FROM products';
    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('Availale for purchase: ');
        console.log('--------------------\n');

        var inventory = '';
        for (var i = 0; i < data.length; i++) {
            inventory = '';
            inventory += 'Item ID: ' + data[i].item_id + '  //  ';
            inventory += 'Product Name: ' + data[i].product_name + '  //  ';
            inventory += 'Department: ' + data[i].department_name + '  //  ';
            inventory += 'Price: $' + data[i].price + '\n';
            inventory += 'Stock: ' + data[i].stock + '\n'; //made stock amounts fall under pricing, easier on the eyes
            console.log(inventory);
        }
        console.log("---------------------------------------------------------------------\n");

        //Prompt the user for item/quantity they would like to purchase
        promptUserPurchase();
    })
}
// ===============================================================================================================================================================

// promptUserPurchase will prompt the user for the item/quantity they would like to purchase, must be a whole number
function promptUserPurchase() {
    // Prompt the user to select an item
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Please enter the Item ID which you would like to purchase.',
            validate: validateInput,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many do you need?',
            validate: validateInput,
            filter: Number
        }
    ]).then(function (input) {

        var item = input.item_id;
        var quantity = input.quantity;
        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw err;
            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                displayInventory();

            } else {
                var productData = data[0];
                if (quantity <= productData.stock) {
                    console.log('Thank you for shopping with BAMAZON! The product you requested is in stock! Placing order!');
                    var updateQueryStr = 'UPDATE products SET stock = ' + (productData.stock - quantity) + ' WHERE item_id = ' + item;
                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log('Your order has been placed! Your total is $' + productData.price * quantity + '(taxes and shipping and handling not included.)');
                        console.log('Thank you for shopping with us!');
                        console.log("\n-----------------------------------------------------------------\n");

                        connection.end();
                    })
                } else {
                    console.log('Sorry, there is not enough product in stock.');
                    console.log('Please choose another item or another quantity.');
                    console.log("\n-----------------------------------------------------------------\n");

                    displayInventory(); //if there isn't enough 
                }
            }
        })
    })
}
 //=================================================================================================================================================================
function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole non-zero number.';
    }
}




// PSUEDO CODE
//Display list
//Ensure that the user input is valid (interger, etc)
//Prompt ID of item they want to buy
//Adjust count
//Prompt amount of inventory
//If not enough, say "insufficient stock" and block
//Prompt "Order Complete"
//Prompt "Total"






