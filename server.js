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
    console.log('Welcome to the Employee Tracking System');
    start();
});

//START WITH THE LIST OF ALL FUNCTIONALITIES 
function start() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'Add a department',
            'Delete a department',
            'Add a role',
            'View all roles',
            'View all employees by manager',
            'Delete a role',
            'Add an employee',
            'View all employees',
            'Update an employee role',
            'Delete an employee',
            'Exit'
        ]
    }).then(answer => {
        console.log(answer);
        switch (answer.action) {
            case 'View all departments':
                viewDep();
                break;
            case 'Add a department':
                addDep();
                break;
            case 'Delete a department':
                deleteDep();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'View all roles':
                viewRole();
                break;
            case 'View all employees by manager':
                viewEmpByMng();
                break;
            case 'Delete a role':
                deleteRole();
                break;
            case 'Add an employee':
                addEmp();
                break;
            case 'View all employees':
                viewEmp();
                break;
            case 'Update an employee role':
                updateEmp();
                break;
            case 'Delete an employee':
                deleteEmp();
                break;
            case 'Exit':
                console.log('Goodbye!');
                connection.end();
                break;
        }
    })
}

//VIEW FUNCTIONS
viewDep = () => {
    console.log('Departments: \n');
    connection.query('SELECT*FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

viewRole = () => {
    console.log('All roles: \n');
    connection.query('SELECT*FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

viewEmp = () => {
    let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee ";
    query += "LEFT JOIN role ON employee.role_id = role.id ";
    query += "LEFT JOIN department ON role.department_id = department.id ";
    query += "LEFT JOIN employee manager ON manager.id = employee.manager_id";
    connection.query(query, (err, res) => {
        if (err) throw errr;
        console.log('All Employees: \n');
        console.table(res);
        start();
    });
}

viewEmpByMng = () => {
    connection.query(`SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager, m.id FROM employee INNER JOIN employee m ON employee.manager_id = m.id`,
        (err, res) => {
            inquirer.prompt({
                name: 'm',
                type: 'list',
                message: "Which manager's employees would you like to view?",
                choices: res.map(item => ({ name: item.manager, value: item.id }))
            }).then(answer => {
                let query = `SELECT employee.id, CONCAT(first_name, ' ', last_name) AS name, role.title
                FROM employee
                INNER JOIN role ON employee.role_id = role.id
                WHERE employee.manager_id = ${answer.m}
                GROUP BY employee.id`;
                // console.log(query);
                connection.query(query,
                    (err, res) => {
                        if (err) throw err;
                        console.log('This is the result:');
                        console.table(res);
                        start();
                    });
            });
        });
}

//ADD FUNCTIONS
addDep = () => {
    inquirer.prompt(
        {
            name: 'depName',
            type: 'input',
            message: 'What is the name of the new department?',
        }
    ).then(answer => {
        connection.query(`INSERT INTO department (name) VALUES ("${answer.depName}")`,
            (err, res) => {
                if (err) throw err;
                console.log(`////////// ${answer.depName} has been added! //////////`);
                start();
            });
    });
}

addRole = () => {
    connection.query('SELECT*FROM department', (req, res) => {
        inquirer.prompt([
            {
                name: 'newRole',
                type: 'input',
                message: 'What is the new role title?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for this role?'
            },
            {
                name: 'assignDep',
                type: 'list',
                message: 'To which department does this role belong to?',
                choices: res.map(item => ({ name: item.name, value: item.id }))
            }
        ]).then(answer => {
            connection.query(`INSERT INTO role(title, salary, department_id) VALUES ("${answer.newRole}", "${answer.salary}", ${answer.assignDep})`,
                (err, res) => {
                    if (err) throw err;
                    console.log(`////////// ${answer.newRole} has been added! ///////////`);
                    start();
                });
        })
    })
}

addEmp = () => {
    connection.query(`SELECT CONCAT(first_name, ' ', last_name) AS manager, id FROM employee`,
        (err, res) => {
            connection.query(`SELECT DISTINCT title, id FROM role`,
                (err, res) => {
                    inquirer.prompt([
                        {
                            name: 'first_name',
                            type: 'input',
                            message: "What is the new employee's first name?"
                        },
                        {
                            name: 'last_name',
                            type: 'input',
                            message: "What is the new employee's last name?"
                        },
                        {
                            name: 'role',
                            type: 'list',
                            message: "What is the new employee's role in the company?",
                            choices: res.map(item => ({ name: item.title, value: item.id }))
                        },
                        {
                            name: 'manager',
                            type: 'list',
                            message: "Who will be this employee's manager?",
                            choices: res.map(item => ({ name: item.manager, value: item.id }))
                        },
                    ]).then(answer => {
                        connection.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${answer.first_name}", "${answer.last_name}", ${answer.role}, ${answer.manager})`,
                            (err, res) => {
                                if (err) throw err;
                                console.log(`////////// ${answer.first_name} ${answer.last_name} has been added!//////////`);
                                start();
                            });
                    });
                });
        });
}

//DELETE FUNCTIONS 
deleteDep = () => {
    connection.query('SELECT name, id FROM department', (err, res) => {
        const depChoices = res.map(item => {
            return { name: item.name, value: item.id }
        });
        // console.log(depChoices);
        inquirer.prompt([
            {
                name: 'depChoice',
                type: 'list',
                message: 'Choose the department you would like to delete',
                choices: depChoices
            }
        ]).then(answer => {
            const chosenDep = depChoices.filter(item => item.value === answer.depChoice);
            let query = `DELETE FROM department WHERE id = ${answer.depChoice}`;
            // console.log(answer.depChoice);
            connection.query(query,
                (err, res) => {
                    if (err) throw err;
                    console.log(`////////// ${chosenDep[0].name} is deleted! //////////`);
                    start();
                });
        });
    });
}

deleteRole = () => {
    connection.query('SELECT title, id FROM role', (req, res) => {
        const roleChoices = res.map(item => ({
            name: item.title,
            value: item.id,
        }));
        inquirer.prompt([
            {
                name: 'roleChoice',
                type: 'list',
                message: 'Choose the role you would like to delete',
                choices: roleChoices
            }
        ]).then(answer => {
            const chosenRole = roleChoices.filter(item => item.value === answer.roleChoice);
            let query = `DELETE FROM role WHERE id = ${answer.roleChoice}`;
            connection.query(query,
                (err, res) => {
                    if (err) throw err;
                    console.log(`////////// ${chosenRole[0].name} is deleted! //////////`)
                    start();
                });
        });
    });
}

deleteEmp = () => {
    connection.query("SELECT CONCAT(first_name, ' ', last_name) AS fullName, id FROM employee", (err, res) => {
        const empChoices = res.map(item => ({
            name: item.fullName,
            value: item.id,
        }));
        inquirer.prompt([
            {
                name: 'empChoice',
                type: 'list',
                message: 'Choose the employee you would like to delete',
                choices: empChoices
            }
        ]).then(answer => {
            const chosenEmp = empChoices.filter(item => item.value === answer.empChoice);
            let query = `DELETE FROM employee WHERE id = ${answer.empChoice}`;
            connection.query(query,
                (err, res) => {
                    if (err) throw err;
                    console.log(`////////// ${chosenEmp[0].name} is deleted! //////////`)
                    start();
                });
        });
    });
}

//UPDATE ROLE 
updateEmp = () => {
    connection.query("SELECT CONCAT(first_name, ' ', last_name) AS Employee, id FROM employee",
        (err, res) => {
            connection.query('SELECT title, id FROM role',
                (err, res) => {
                    inquirer.prompt([
                        {
                            name: 'updateWho',
                            type: 'list',
                            message: 'Choose the employee that need to be update',
                            choices: res.map(choice => ({ name: choice.employee, value: choice.id }))
                        },
                        {
                            name: 'updateRole',
                            type: 'list',
                            message: 'What is the new role of this employee?',
                            choices: res.map(choice => ({ name: choice.title, value: choice.id }))
                        }
                    ]).then(answer => {
                        connection.query(`UPDATE employee SET role_id = ${answer.updateRole} WHERE id = ${answer.updateWho}`,
                            (err, res) => {
                                if (err) throw err;
                                console.log(`///////// This employee's role has been updated! //////////`);
                                start();
                            });
                    });
                });
        });
}



