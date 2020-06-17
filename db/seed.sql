INSERT INTO department (name)
VALUES ('sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 85000, 1),
        ('Salesperson', 60000, 1),
        ('Lead Engineer', 130000, 2),
        ('Sotfware Engineer', 100000, 2),
        ('Accounting Manager', 115000, 3),
        ('Accountant', 75000, 3),
        ('Lead Lawyer', 180000, 4),
        ('Lawyer', 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Luis', 'Garavito', 1, null),
        ('Pedro', 'Lopez', 2, null),
        ('Javed', 'Iqbal', 3, null),
        ('Mikhail', 'Popkov', 4, null),
        ('Daniel', 'Barbosa', 5, null),
        ('Pedro', 'Rodriguez', 6, null),
        ('Kampatimar', 'Shankariya', 7, null),
        ('Yang', 'Xinhai', 8, null);