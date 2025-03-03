const mysql = require('mysql2');

// Database connection details
const connection = mysql.createConnection({
  host: 'srv1002.hstgr.io', // e.g., mysql.hostinger.com
  user: 'u833212223_hrms_new',
  password: 'HrMs@123',
  database: 'u833212223_hrms_new',
  port: 3306 // Default MySQL port
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
