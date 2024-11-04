const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const mysql = require('mysql2');

console.log(process.env);
// mySQL init
const con = mysql.createConnection({
  host: process.env.DB_HOST, // 'db' from docker-compose
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const generateUniqueRoutingNumber = () => {
  return new Promise((resolve, reject) => {
    // Generate a random routing number
    const routingNum = Math.floor(100000000 + Math.random() * 900000000);
    const sqlCheck = 'SELECT COUNT(*) AS count FROM customer_info WHERE routing_num = ?';

    // Check if the generated routing number is unique
    con.query(sqlCheck, [routingNum], (err, results) => {
      if (err) return reject(err); // Reject the promise if there is a query error

      if (results[0].count > 0) {
        // If not unique, recursively call the function to generate a new one
        resolve(generateUniqueRoutingNumber());
      } else {
        // Return the unique routing number
        resolve(routingNum);
      }
    });
  });
};

// FUNCTIONAL
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var num = generateUniqueRoutingNumber();
//   //var sql = "INSERT INTO customer_info (username, password, routing_num) VALUES ('george.washington', 'america', '${num})'";
//   var sql = "INSERT INTO customer_info (username, password, routing_num) VALUES (?, ?, ?)";
//   var values = ['george.washington', 'america', num]; // Prepare values for insertion
//   con.query(sql, values, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
// });

// Routing for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

// Serves all files under the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, './css/bootstrap5.css'))
})

// Parse JSON request bodies
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).send({ error: 'Invalid JSON payload' });
  }
  next();
});

// Cookies and sessions
app.use(session({
  secret: 'default',
  resave: false,
  saveUninitialized:   
 false
}));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received:', { username, password });
  const sql = 'SELECT * FROM customer_info WHERE username = ? AND password = ?';
  con.query(sql, [username, password], function (err, result) {
    if (err) throw err;
    console.log(result); // result will contain the row(s) where username and password match
  
    if (result.length > 0) {
      // Map result info into session data
      req.session.user = {
        username: result[0].username,
        password: result[0].password,
        dollars: result[0].dollars,
        cents: result[0].cents,
        routing_num: result[0].routing_num
      };
  
      // Set the session cookie
      res.cookie('sessionId', req.sessionID, { httpOnly: true });
      res.status(200);
      res.redirect('/dashboard');
    } else {
      res.status(401).send('Invalid username or password');
    }
  });
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Validate the input
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // Check for unique username
  const checkUsernameSql = 'SELECT COUNT(*) AS count FROM customer_info WHERE username = ?';

  con.query(checkUsernameSql, [username], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).send('Error checking username');
    }

    if (results[0].count > 0) {
      return res.status(400).send('Username already exists');
    }

    // Generate a random balance between $10,000 and $20,000
    const dollars = Math.floor(Math.random() * 10001) + 10000; // Random dollars between 10,000 and 20,000
    const cents = Math.floor(Math.random() * 100); // Random cents between 0 and 99

    // Generate a unique routing number
    generateUniqueRoutingNumber()
      .then(uniqueRoutingNum => {
        console.log('Generated unique routing number:', uniqueRoutingNum);

        // SQL query to insert a new user with the generated balance
        const sql = 'INSERT INTO customer_info (username, password, dollars, cents, routing_num) VALUES (?, ?, ?, ?, ?)';

        // Execute the query with the username, password, balance, and routing number
        con.query(sql, [username, password, dollars, cents, uniqueRoutingNum], (err, result) => {
          if (err) {
            console.error('Error creating new user:', err);
            return res.status(500).send('Error creating new user');
          }
          console.log('New user created:', result);
          res.status(201).redirect('/');  // Redirect to the login page after successful signup
        });
      })
      .catch(err => {
        console.error('Error generating unique routing number:', err);
        return res.status(500).send('Error generating unique routing number');
      });
  });
});



// Dashboard of bank accounts
app.get('/dashboard', (req, res) => {
  const user = req.session.user
  if (req.sessionID) {
    // User is authenticated
    res.sendFile(path.join(__dirname, './public/dashboard.html'))
  } else {
    res.redirect('/');
  }
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, './public/signup.html'));
});

app.get('/transfer', (req, res) => {
  res.sendFile(path.join(__dirname, './public/transfer.html'));
});

app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, './public/help.html'));
});

// Search endpoint
app.get('/search', (req, res) => {
  // Get the search query from the URL without sanitization
  const query = req.query.query; // User input directly taken from query string

  // SQL query to search the help_pages table
  // Directly concatenate the user input into the SQL query (insecure)
  const sql = `SELECT title, content FROM help_pages WHERE title LIKE '%${query}%'`;

  console.log('Executing SQL:', sql); // Log the query for debugging

  con.query(sql, (error, results) => {
      if (error) {
          console.error('Error executing query:', error);

          // Provide detailed error information
          return res.status(500).json({
              error: 'An internal server error occurred while executing the SQL query.',
              details: {
                  message: error.message, // General error message
                  code: error.code,       // SQL error code
                  sqlState: error.sqlState, // SQL state (if applicable)
                  sql: sql,               // SQL that caused the error
                  query: query            // Original user query for reference
              }
          });
      }

      // Check if results are found
      if (results.length === 0) {
          return res.status(404).json({
              message: 'No results found for your search term. Please try a different term.',
              query: query // Echo back the query for user reference
          });
      }

      // Send the results back to the client
      res.json(results);
  });
});

// Money Transfer Endpoint
app.post('/transfer', (req, res) => {
  console.log(req.body); // Log the entire body for debugging
  const { accountNumber, amount } = req.body;

  console.log(accountNumber, amount); // Check if they are undefined

  const userRoutingNum = req.session.user.routing_num; // Accessing routing_num from the session
  console.log(userRoutingNum);
  // Basic validation
  if (!accountNumber || amount <= 0) {
      return res.status(400).json({ error: 'Invalid account number or amount' });
  }

  // Get current user's balance
  const getUserBalanceSql = 'SELECT dollars FROM customer_info WHERE routing_num = ?';
  
  con.query(getUserBalanceSql, [userRoutingNum], (error, results) => {
      if (error) {
          console.error('Error fetching user balance:', error);
          return res.status(500).json({ error: 'Error fetching user balance' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      const userBalance = results[0].dollars;

      // Check if user has enough balance
      if (userBalance < amount) {
          return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Subtract amount from user's balance
      const updateUserBalanceSql = 'UPDATE customer_info SET dollars = dollars - ? WHERE routing_num = ?';
      
      con.query(updateUserBalanceSql, [amount, userRoutingNum], (error) => {
          if (error) {
              console.error('Error updating user balance:', error);
              return res.status(500).json({ error: 'Error updating user balance' });
          }

          // Add amount to target account
          const updateTargetAccountSql = 'UPDATE customer_info SET dollars = dollars + ? WHERE routing_num = ?';
          
          con.query(updateTargetAccountSql, [amount, accountNumber], (error) => {
              if (error) {
                  console.error('Error updating target account balance:', error);
                  return res.status(500).json({ error: 'Error updating target account balance' });
              }

              // Respond with success
              res.status(200).json({ message: 'Transfer successful' });
          });
      });
  });
});

// Gets the user data
app.get('/user-data', (req, res) => {
  if (req.session.user) {
    // Assume dollars and cents make up the balance, format as a single string
    const { username, dollars, cents, routing_num } = req.session.user;
    const balance = `${dollars}.${cents.toString().padStart(2, '0')}`;

    // Respond with the data structure your dashboard expects
    res.json({
      username,
      accountNum: routing_num,
      money: balance,
    });
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})