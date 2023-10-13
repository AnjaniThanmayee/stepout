const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors=require('cors')
const app = express();

app.use(cors())
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'railway'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Registration successful' });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

app.post('/admin-login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
      res.json({ message: 'Admin login successful' });
    } else {
      res.status(401).json({ message: 'Admin authentication failed' });
    }
  });

  app.get('/trains', (req, res) => {
    const query = 'SELECT * FROM trains';
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
  app.get('/usertrains', (req, res) => {
    const { source, destination } = req.query;
    const query = `
      SELECT * FROM trains
      WHERE source = ? AND destination = ?;
    `;
  
    db.query(query, [source, destination], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
      } else {
        res.json(results);
      }
    });
  });
  app.post('/addTrain', (req, res) => {
    const trains = req.body;
    db.query('INSERT INTO trains SET ?', trains, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add a new train' });
      } else {
        res.status(201).json({ message: 'Train added successfully' });
      }
    });
  });

  
  app.delete('/deleteTrain/:trainNumber', (req, res) => {
    const trainNumber = req.params.trainNumber;
    db.query('DELETE FROM trains WHERE trainNumber = ?', trainNumber, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the train' });
      } else {
        res.status(200).json({ message: `Train ${trainNumber} deleted` });
      }
    });
  });
  
  app.put('/addSeats/:trainNumber', (req, res) => {
    const trainNumber = req.params.trainNumber;
    const { seats } = req.body;
    db.query(
      'UPDATE trains SET seats = seats + ? WHERE trainNumber = ?',
      [seats, trainNumber],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to add seats to the train' });
        } else {
          db.query('SELECT * FROM trains WHERE trainNumber = ?', trainNumber, (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: 'Failed to fetch train data' });
            } else {
              res.status(200).json(results[0]);
            }
          });
        }
      }
    );
  });
  
  app.delete('/deleteSeats/:trainNumber', (req, res) => {
    const trainNumber = req.params.trainNumber;
    const { seats } = req.body;
    db.query(
      'UPDATE trains SET seats = GREATEST(seats - ?, 0) WHERE trainNumber = ?',
      [seats, trainNumber],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to delete seats from the train' });
        } else {
          db.query('SELECT * FROM trains WHERE trainNumber = ?', trainNumber, (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).json({ error: 'Failed to fetch train data' });
            } else {
              res.status(200).json(results[0]);
            }
          });
        }
      }
    );
  });

  app.get('/getAllTrains', (req, res) => {
    db.query('SELECT * FROM trains', (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch all trains' });
      } else {
        res.status(200).json(results);
      }
    });
  });
  app.post('/bookTickets/:trainNumber', (req, res) => {
    const trainNumber = req.params.trainNumber;
    
    const { numTickets,trainName} = req.body;
    db.query('SELECT seats FROM trains WHERE trainNumber = ?', trainNumber, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to book tickets' });
      } else {
        const availableSeats = results[0].seats;
  
        if (numTickets > availableSeats) {
          res.status(400).json({ error: 'Not enough seats available' });
        } else {
          db.query(
            'UPDATE trains SET seats = seats - ? WHERE trainNumber = ?',
            [numTickets, trainNumber,trainName],
            (error, results) => {
              if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to update seat count' });
              } else {
                const bookingId = Math.floor(Math.random() * 1000); 
                const bookingData = {
                  trainNumber: trainNumber,
                  numTickets: numTickets,
                  bookingId: bookingId,
                  totalAmount: numTickets * 100, 
                  trainName: trainName,
                };
                db.query('INSERT INTO bookings SET ?', bookingData, (error, results) => {
                  if (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Failed to create booking record' });
                  } else {
                    res.status(200).json(bookingData);

                  }
                });
              }
            }
          );
        }
      }
    });
  });
  

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
