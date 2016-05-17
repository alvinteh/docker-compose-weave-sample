import express from 'express';
import mysql from 'mysql';
import path from 'path';
import winston from 'winston';

// Server configuration
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 80;

// Register app
const app = express();

// Register static assets
const publicPath = path.resolve(__dirname, 'www');
app.use(express.static(publicPath));

// Implement helper function
const performQuery = (query, r) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'mysql-sample',
      user: 'root',
      password: 'username1',
      database: 'test'
    });

    connection.connect();

    connection.query(query, (err, recordset) => {
      connection.end();

      if (err) {
        reject(err);
      }
      else {
        resolve(recordset);
      }
    });
  });
};

// Implement primary endpoint
app.get('/', (req, res) => {
  performQuery('SELECT * FROM posts;', res)
  .then((rows) => {
    let response = '';

    rows.forEach((row) => {
      response += `${row.title}<br />`;
    });

    res.send(response);
  })
  .catch((err) => {
    res.send(`Error: ${response}`);
  });
});

// Implement initialization endpoint
app.get('/init', (req, res) => {
  performQuery('CREATE TABLE posts(id INT NOT NULL AUTO_INCREMENT, title VARCHAR(255) NOT NULL, PRIMARY KEY(id) );')
  .then(() => {
     res.send('Initialized database successfully.');
  })
  .catch((err) => {
    res.send(`Error: ${response}`);
  });
});

// Implement insertion endpoint
app.get('/populate', (req, res) => {
  const randomTitle =  'Title ' + Math.ceil(Math.random() * 255); 
  const query = `INSERT INTO posts(title) VALUES ("${randomTitle}");`;

  performQuery(query)
  .then(() => {
     res.send('Populated database successfully.');
  })
  .catch((err) => {
    res.send(`Error: ${response}`);
  });
});

// Register app listener
app.listen(port, host, (err) => {
  if (err) {
    winston.error(err);
    return;
  }

  winston.log(`Application ready at http://${host}:${port}`);
});
