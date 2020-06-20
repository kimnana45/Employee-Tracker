DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT, 
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR (30),
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR (40) NOT NULL, 
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT, 
    PRIMARY KEY(id)
);

CREATE TABLE allEmployees AS 
SELECT  employee.id, employee.first_name, employee.last_name,employee.manager_id, role.title, role.salary, department.name
FROM employee
LEFT JOIN role ON employee.role_id=role.id
LEFT JOIN department ON role.department_id=department.id
ORDER BY employee.id;

-- ALL EMPLOYEES --

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee 
LEFT JOIN role on employee.role_id = role.id
LEFT JOIN department on role.department_id = department.id 
LEFT JOIN employee manager on manager.id = employee.manager_id;

-- BY MANAGER --

SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, role.department_id AS department, CONCAT(m.first_name, " ", m.last_name) AS manager 
FROM employee
LEFT JOIN role ON employee.role_id = role.id
INNER JOIN department ON role.department_id = department_id 
INNER JOIN employee m ON employee.manager_id = m.id WHERE CONCAT(m.first_name, " ", m.last_name) IN ('Luis Garavito')
GROUP BY employee.id;

