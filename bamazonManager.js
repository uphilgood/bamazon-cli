var mysql = require("mysql");
var inquirer = require("inquirer")
var Table = require('cli-table2');
var path
var list
var productId
var numOfProducts
var nameOfProduct
var priceOfProduct
var department
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
            return lowInventory();

        case "Add to Inventory":
            return add()

        case "Add New Product":
            return addNewProduct()

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
}

function lowInventory() {
    connection.query('SELECT * from products where stock_quantity < 5', function (error, results, fields) {
        if (error) throw error;
        results.forEach(data => {
           list = data
            table.push([data.item_id, data.product_name, data.price, data.stock_quantity])
            
        })
        if (!list) {
            console.log("There are no items whose stock is less than 5!")
        } else {
        console.log(table.toString())
        }
    });
    connection.end();
}

function add() {
    viewAllProducts()
    inquirer.prompt([{
                name: "id",
                message: " What is the ID of the product you would like to add?" + '\n'
            },
            {
                name: "numberOfProducts",
                message: " How many would you like to add?" + '\n'
            }
        ])
        .then(data => {
            productId = data.id
            numOfProducts = data.numberOfProducts
            console.log("You want product ID: " + productId + '\n' +
                "You want to add " + numOfProducts + " items")
                getQuantity(productId)
        });
        
}

function getQuantity(productId) {
    connection.query('select stock_quantity from products where item_id = ?', [productId], function (error, results, fields) {
        if (error) throw error;
        results.forEach(data => {
            numOfProductsToUpdate = parseInt(data.stock_quantity) + parseInt(numOfProducts)
        })
            console.log("There is a total of " + numOfProductsToUpdate + " now for that item!")
            addInventory()   
    });
}

function addInventory() {
    connection.query('update products set stock_quantity = ? where item_id = ?', [numOfProductsToUpdate, productId], function (error, results, fields) {
        if (error) throw error;
        // viewAllProducts()
    })

    connection.end()
}

function addNewProduct() {
    viewAllProducts()
    inquirer.prompt([{
                name: "name",
                message: " What Product do you want to add?" + '\n'
            },
            {
                name: "price",
                message: " How much is this Product?" + '\n'
            },
            {
                name: "department",
                message: " What department is this item in?" + '\n'
            },
            {
                name: "numberOfProducts",
                message: " How many would you like to add?" + '\n'
            }
        ])
        .then(data => {
            nameOfProduct = data.name
            priceOfProduct= data.price
            department = data.department
            numOfProducts = data.numberOfProducts
            console.log("You want product ID: " + productId + '\n' +
                "You want to add " + numOfProducts + " items")
                newProduct(nameOfProduct, priceOfProduct, department, numOfProducts)
        });
        
}

function newProduct(nameOfProduct, priceOfProduct, department, numOfProducts) {
    connection.query('INSERT INTO products (product_name, price, department_name, stock_quantity) VALUE (?, ?, ?, ?) ', [nameOfProduct, priceOfProduct, department, numOfProducts], function (error, results, fields) {
        if (error) throw error;
        viewAllProducts()
    })
}

connectDb()
managerMode()