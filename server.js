const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

//SET UP CONNECTION 
const connection = mysql.createConnection({
    host: "localhost", 
    port: 3306,
    user: "root",
    password: "iamgroot",
    database: "employees_db"
});

//CONNECT TO MYSQL
connection.connect(err => {
    if (err) throw err;
    console.log('so far so good');
});