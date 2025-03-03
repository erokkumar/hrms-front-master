const express = require('express');
const fs = require('fs');
const cors = require('cors');
//const js2xml = require('xml-js');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
//const builder = new xml2js.Builder();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rohit@876',
    database: 'Hrms',
    port: 3306,
});

app.use(cors());
app.use(express.json());

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// File Paths
const usersFile = 'users.xml';
//const trackingFile = 'time_tracking.xml';
//const apply_leaves = 'applied_leaves.xml';

// Fetch Users from XML
app.get('/users', (req, res) => {
    fs.readFile(usersFile, 'utf-8', (err, data) => {
        if (err) return res.status(500).send('Error reading user XML file');
        xml2js.parseString(data, (err, result) => {
            if (err) return res.status(500).send('Error parsing XML');
            res.json(result.users.user);
        });
    });
});

// Register Employee
app.post('/api/register', async (req, res) => {
  const { name, user_email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO employees (name, user_email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, user_email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Registration failed' });
      res.json({ message: 'Employee registered successfully', id: result.insertId });
  });
});

// Employee Login


// Protected Route Example
app.get('/api/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Unauthorized' });

      res.json({ message: 'Protected data accessed', user: decoded });
  });
});


// Fetch Leaves from Database
app.get('/api/leaves', (req, res) => {
    const sql = 'SELECT * FROM leave_applications';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
});

// Fetch Tickets from Database
app.get('/api/ticket', (req, res) => {
    const sql = 'SELECT * FROM ticket';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
});

// Fetch Tasks from Database (Fixed)
app.get('/api/task', (req, res) => {
    const sql = 'SELECT * FROM task';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
});

// Add Leave Application
app.post('/api/leaves', (req, res) => {
    const { name, leave_type, date, end_date, reason, status, action } = req.body;
    const sql = `INSERT INTO leave_applications (name, leave_type, date, end_date, reason, status)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [name, leave_type, date, end_date, reason, status, action], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database insertion failed' });
        res.json({ message: 'Leave application added', id: result.insertId });
    });
});

// Update leaves from the database
app.put('/api/leaves/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updates = req.body;

    // Validate ID
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    // Ensure at least one field is provided for update
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'At least one field must be updated' });
    }

    // Build SQL dynamically based on provided fields
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const sql = `UPDATE leave_applications SET ${fields} WHERE id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Update Error:', err);
            return res.status(500).json({ error: 'Database update failed', details: err.sqlMessage });
        }

        // Check if the task exists
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found'});
        }

        res.json({ message: 'Leaves updated successfully' });
    });
});

//Delete Oprations for Leves 

app.delete('/api/leaves/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid leave application ID' });
  }

  const sql = `DELETE FROM leave_applications WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
      if (err) {
          console.error('Delete Error:', err);
          return res.status(500).json({ error: 'Database deletion failed', details: err.sqlMessage });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Leave application not found' });
      }
      res.json({ message: 'Leave application deleted successfully' });
  });
});
app.delete('/api/task/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid leave application ID' });
  }

  const sql = `DELETE FROM task WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
      if (err) {
          console.error('Delete Error:', err);
          return res.status(500).json({ error: 'Database deletion failed', details: err.sqlMessage });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'task application not found' });
      }
      res.json({ message: 'Task application deleted successfully' });
  });
});
app.put('/api/task/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updates = req.body;

    // Validate ID
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    // Ensure at least one field is provided for update
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'At least one field must be updated' });
    }

    // Build SQL dynamically based on provided fields
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const sql = `UPDATE task SET ${fields} WHERE id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Update Error:', err);
            return res.status(500).json({ error: 'Database update failed', details: err.sqlMessage });
        }

        // Check if the task exists
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found'});
        }

        res.json({ message: 'Task updated successfully' });
    });
});



// Add Ticket (Fixed Column Names)
app.post('/api/ticket', (req, res) => {
  const { title, employename, priority, date, description, action, ticket_raised_by} = req.body;

  if (!title || !employename || !priority || !date  || !description || !action ||!ticket_raised_by) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  const ticketcode = `TKT-${uuidv4().substring(0, 8).toUpperCase()}`; // Generate unique ticket code

  const sql = `INSERT INTO ticket (title, ticketcode, employename, priority, date,  description, action , ticket_raised_by)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [title, ticketcode, employename, priority, date, description, action, ticket_raised_by], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.json({ message: 'Ticket added successfully', ticketcode, id: result.insertId });
  });
});
/** 
 * 🟡 UPDATE: Modify a Ticket
 */
app.put('/api/ticket/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updates = req.body;

    // Validate ID
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    // Ensure at least one field is provided for update
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'At least one field must be updated' });
    }

    // Build SQL dynamically based on provided fields
    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const sql = `UPDATE ticket SET ${fields} WHERE id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Update Error:', err);
            return res.status(500).json({ error: 'Database update failed', details: err.sqlMessage });
        }

        // Check if the task exists
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found'});
        }

        res.json({ message: 'Task updated successfully' });
    });
});


/** 
 * 🔴 DELETE: Remove a Ticket
 */
app.delete('/api/ticket/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM ticket WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Database deletion failed' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Ticket not found' });
      }
      res.json({ message: 'Ticket deleted successfully' });
  });
});


// Add Task (Fixed Column Names)
app.post('/api/task', (req, res) => {
    const { task, effort, allocation_time, project, date, discription, action,allocated_by,allocated_to } = req.body;
    const sql = `INSERT INTO task (task, effort, allocation_time, project, date, discription, action ,allocated_by , allocated_to)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`;

    db.query(sql, [task, effort, allocation_time, project, date, discription, action , allocated_by ,allocated_to], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database insertion failed', err });
        res.json({ message: 'Task added', id: result.insertId });
    });
});


const generateemp_id = (callback) => {
    db.query("SELECT emp_id FROM user ORDER BY id DESC LIMIT 1", (err, result) => {
      if (err) {
        return callback(err, null);
      }
  
      let nextId = 1;
      if (result.length > 0) {
        const lastemp_id = result[0].emp_id;
        const lastNumber = parseInt(lastemp_id.replace("wsdsemp", ""), 10);
        nextId = lastNumber + 1;
      }
  
      const newemp_id = `wsdsemp${String(nextId).padStart(3, "0")}`;
      callback(null, newemp_id);
    });
  };
  
  // POST API to insert user data
  app.post("/api/users", (req, res) => {
    const { user_email, password, role, user_name, dob } = req.body;
  
    if (!user_email || !password || !role || !user_name || !dob) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    generateemp_id((err, emp_id) => {
      if (err) {
        return res.status(500).json({ error: "Failed to generate emp_id" });
      }
  
      // Hash the password before storing it
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }
  
        const sql = "INSERT INTO user (emp_id, user_email, password, role, user_name, dob) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [emp_id, user_email, hashedPassword, role, user_name, dob], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
          }
  
          res.status(201).json({
            message: "User added successfully",
            userId: result.insertId,
            emp_id: emp_id,
          });
        });
      });
    });
  });
  app.put("/api/users/:emp_id", (req, res) => {
    const { emp_id } = req.params;
    const { user_email, role, user_name, dob, password } = req.body;

    if (!user_email || !role || !user_name || !dob) {
        return res.status(400).json({ error: "All fields except password are required" });
    }

    // Check if the user wants to update the password
    if (password) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: "Error hashing password" });
            }

            const sql = "UPDATE user SET user_email = ?, role = ?, user_name = ?, dob = ?, password = ? WHERE emp_id = ?";
            db.query(sql, [user_email, role, user_name, dob, hashedPassword, emp_id], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: "Database error" });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: "User not found" });
                }

                res.status(200).json({ message: "User updated successfully, including password change" });
            });
        });
    } else {
        // Update without changing the password
        const sql = "UPDATE user SET user_email = ?, role = ?, user_name = ?, dob = ? WHERE emp_id = ?";
        db.query(sql, [user_email, role, user_name, dob, emp_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User updated successfully" });
        });
    }
});


  app.get("/api/users", (req, res) => {
    const sql = 'SELECT * FROM user';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
    });
  });

  
  app.post("/api/login", (req, res) => {
    const { user_email, password } = req.body;
  
    if (!user_email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
    const sql = "SELECT * FROM user WHERE user_email = ?";
    db.query(sql, [user_email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
  
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const user = results[0];
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      const token = jwt.sign({ emp_id: user.emp_id, role: user.role }, "secretKey", { expiresIn: "1h" });
  
      res.json({ message: "Login successful", token, empName: user.user_name, emp_id: user.emp_id});
    });
  });

  // POST API to add employee attendance
  app.post("/api/attendance", (req, res) => {
    const { emp_id, emp_name, clock_in, clock_out } = req.body;

    if (!emp_id || !emp_name) {
        return res.status(400).json({ error: "Employee ID and Name are required" });
    }

    // If it's a Clock In request
    if (clock_in && !clock_out) {
        const sql = "INSERT INTO employee_attendance (emp_id, emp_name, clock_in) VALUES (?, ?, ?)";
        db.query(sql, [emp_id, emp_name, clock_in], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
            res.status(201).json({ message: "Clock In recorded successfully" });
        });
    }
    // If it's a Clock Out request
    else if (clock_out) {
        const sql = "UPDATE employee_attendance SET clock_out = ? WHERE emp_id = ? AND clock_out IS NULL";
        db.query(sql, [clock_out, emp_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
            if (result.affectedRows === 0) {
                return res.status(400).json({ error: "No Clock In found for this Employee ID" });
            }
            res.status(200).json({ message: "Clock Out recorded successfully" });
        });
    } else {
        res.status(400).json({ error: "Invalid request" });
    }
});



// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
