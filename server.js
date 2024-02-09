const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('todo.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, date TEXT)');
});

app.use(express.static(__dirname));

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/addTask', (req, res) => {
  const task = req.body.task;
  const date = req.body.date;

  db.run('INSERT INTO tasks (task, date) VALUES (?, ?)', [task, date], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Task added successfully' });
    }
  });
});

app.post('/removeTask', (req, res) => {
  const task = req.body.task;
  const date = req.body.date;

  db.run('DELETE FROM tasks WHERE task = ? AND date = ?', [task, date], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Task removed successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
