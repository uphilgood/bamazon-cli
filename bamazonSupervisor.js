var mysql = require("mysql");
var inquirer = require("inquirer")
var Table = require('cli-table2');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Family123",
    database: "bamazon"
});

var table = new Table({
    head: ['Department ID', 'Department Name', 'Over Head Cost', 'Product Sales', 'Total Profit'],
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

function supervisorMode() {
    inquirer.prompt([{
            name: "id",
            message: "Menu Options",
            type: "checkbox",
            choices: ["View Product Sales by Department",
                "Create New Department"
            ]
        }])
        .then(data => {
            path = data.id.toString()
            view()
        });
}

function view() {
    switch (path) {

        case "View Product Sales by Department":
            return viewProductSales();

        case "Create New Department":
            return lowInventory();

        default:
            return console.log("default!");
    }
}

function viewProductSales() {
    connection.query('select d.department_id, d.department_name, d.over_head_costs, p.product_sales, (product_sales - over_head_costs) as total_profit  from departments d join products p on p.department_name = d.department_name group by d.department_id, d.department_name, d.over_head_costs, p.product_sales order by d.department_id', function (error, results, fields) {
        if (error) throw error;
        results.forEach(data => {
            table.push([data.department_id, data.department_name, data.over_head_costs, data.product_sales, data.total_profit])

        })
        console.log(table.toString())
    });
}

connectDb()
supervisorMode()