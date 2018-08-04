var mysql = require("mysql");
var inquirer = require("inquirer")
var Table = require('cli-table2');
var productId
var numOfProducts
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Family123",
    database: "bamazon"
});

// instantiate
var table = new Table({
    head: ['ID', 'Product Name', 'Price'],
    chars: {
        'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
        , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
        , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
        , 'right': '║' , 'right-mid': '╢' , 'middle': '│'
    }
});


function connectDb() {
    connection.connect(function (err) {
        if (err) throw err;
    });
}

function displayStock() {
    connection.query('SELECT * from products', function (error, results, fields) {
        if (error) throw error;
        results.forEach(data => {

            table.push([data.item_id, data.product_name, data.price])

        })
        console.log(table.toString())
    });
    // connection.end();
    askUser()
}

function askUser() {
    inquirer.prompt([{
                name: "id",
                message: " What is the ID of the product you would like to buy?" + '\n'
            },
            {
                name: "numberOfProducts",
                message: " How many would you like to buy?" + '\n'
            }
        ])
        .then(data => {
            productId = data.id
            numOfProducts = data.numberOfProducts
            console.log("you want product ID: " + productId + '\n' +
                "you want to buy " + numOfProducts)
            buyProduct()
        });
}

function buyProduct() {
    connection.query('select stock_quantity, price, product_name from products where item_id = ?', [productId], function (error, results, fields) {
        if (error) throw error;
        results.forEach(data => {
            itemPrice = data.price
            purchasedItem = data.product_name
            updateAmount = data.stock_quantity - numOfProducts
        })
        if (updateAmount < 0) {
            console.log(`Insufficient quantity!`)
            askUser()
        } else {
            console.log("You have been charged $" + itemPrice * numOfProducts)
            updateQuery()
        }
    });
}

function updateQuery() {
    connection.query('update products set stock_quantity = ? where item_id = ?', [updateAmount, productId], function (error, results, fields) {
        if (error) throw error;
        console.log("There are " + updateAmount + " " + purchasedItem + " items left!")
    })
    connection.end();
}

connectDb()
displayStock()