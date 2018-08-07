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
    head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales','Total Profit', ],
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
    connection.query('select d.Department_ID, d.Department_Name, d.over_head_costs, p.total_sales, (d.over_head_costs - p.total_sales) as Total_Revenue from departments d join (select department_name, sum(product_sales) as total_sales from products group by department_name) p on p.department_name = d.department_name', function (error, results, fields) {
        if (error) throw error;
        results.forEach(data => {
            table.push([data.Department_ID, data.Department_Name, data.over_head_costs, data.total_sales, data.Total_Revenue])

        })
        console.log(table.toString())
    });
}

connectDb()
supervisorMode()