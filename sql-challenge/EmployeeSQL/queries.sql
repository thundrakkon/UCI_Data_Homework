-- List the following details of each employee: employee number, last name, first name, gender, and salary.
SELECT * FROM employees;
SELECT * FROM salaries;

SELECT e.emp_no, e.last_name, e.first_name, e.gender, s.salary
FROM employees AS e
JOIN salaries AS s
ON e.emp_no = s.emp_no;

-- List employees who were hired in 1986.
SELECT * FROM employees;

SELECT * 
FROM employees
WHERE EXTRACT(YEAR FROM hire_date) = 1986;

-- List the manager of each department with the following information: department number, department name, the manager's employee number, last name, first name, and start and end employment dates.
SELECT * FROM department_manager;
SELECT * FROM departments;
SELECT * FROM employees;
SELECT * FROM department_employees;

SELECT d.dept_no, d.dept_name, d_m.emp_no, e.last_name, e.first_name, d_e.from_date, d_e.to_date
FROM department_employees AS d_e
JOIN employees AS e
ON e.emp_no = d_e.emp_no
	JOIN department_manager AS d_m
	ON d_e.emp_no = d_m.emp_no
		JOIN departments AS d
		ON d_m.dept_no = d.dept_no;

-- List the department of each employee with the following information: employee number, last name, first name, and department name.
SELECT * FROM employees;
SELECT * FROM department_employees;
SELECT * FROM departments;

SELECT e.emp_no, e.last_name, e.first_name, d.dept_name
FROM departments AS d
JOIN department_employees AS d_e
ON d.dept_no = d_e.dept_no
	JOIN employees AS e
	ON d_e.emp_no = e.emp_no
	ORDER BY e.emp_no;

-- List all employees whose first name is "Hercules" and last names begin with "B."
SELECT * FROM employees;

SELECT * FROM employees
WHERE first_name = 'Hercules'
AND last_name like 'B%';

-- List all employees in the Sales department, including their employee number, last name, first name, and department name.
SELECT * FROM departments;
SELECT * FROM department_employees;
SELECT * FROM employees;

SELECT e.emp_no, e.last_name, e.first_name, d.dept_name
FROM employees AS e
JOIN department_employees AS d_e
ON e.emp_no = d_e.emp_no
	JOIN departments AS d
	ON d_e.dept_no = d.dept_no
	WHERE dept_name = 'Sales';

-- List all employees in the Sales and Development departments, including their employee number, last name, first name, and department name.

SELECT e.emp_no, e.last_name, e.first_name, d.dept_name
FROM employees AS e
JOIN department_employees AS d_e
ON e.emp_no = d_e.emp_no
	JOIN departments AS d
	ON d_e.dept_no = d.dept_no
	WHERE dept_name = 'Sales'
	OR dept_name = 'Development';

-- In descending order, list the frequency count of employee last names, i.e., how many employees share each last name.

SELECT last_name, COUNT(last_name) AS "name_frequency"
FROM employees
GROUP BY last_name
ORDER BY "name_frequency" DESC;
