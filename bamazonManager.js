var mysql = require("mysql");
var inquirer = require("inquirer")
var Table = require('cli-table');
var path
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Family123",
    database: "bamazon"
});

var table = new Table({
    head: ['ID', 'Product Name', 'Price', "Quantity"],
    chars: {
        'top': '═',
        'top-mid': '╤',
        'top-left': '╔',
        'top-right': '╗',
        'bottom': '═',
        'bottom-mid': '╧',
        'bottom-left': '╚',
        'bottom-right': '╝',
        'left': '║',
        'left-mid': '╟',
        'mid': '─',
        'mid-mid': '┼',
        'right': '║',
        'right-mid': '╢',
        'middle': '│'
    }
});

function connectDb() {
    connection.connect(function (err) {
        if (err) throw err;
    });
}

function managerMode() {
    inquirer.prompt([{
            name: "id",
            message: "Menu Options",
            type: "checkbox",
            choices: ["View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }])
        .then(data => {
            path = data.id.toString()
            view()
        });
}

function view() {
    switch (path) {

        case "View Products for Sale":
            return viewAllProducts();

        case "View Low Inventory":
            return console.log("view low inventory!");

        case "Add to Inventory":
            return console.log("Add to Inventory")

        case "Add New Product":
            return console.log("Add New Product")

        default:
            return console.log("default!");
    }
}

function viewAllProducts() {
    connection.query('SELECT * from products', function (error, results, fields) {
        if (error) throw error;
        results.forEach(data => {

            table.push([data.item_id, data.product_name, data.price, data.stock_quantity])

        })
        console.log(table.toString())
    });
    connection.end();
}

connectDb()
managerMode()