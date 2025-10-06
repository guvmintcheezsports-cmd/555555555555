const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const Database = require('better-sqlite3');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up the SQLite database
const db = new Database(process.env.SQLITE_FILE || './data.sqlite');
db.prepare("CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY, buyer TEXT, paid INTEGER)").run();

// API route
app.get('/api/tickets', (req, res) => {
  const tickets = db.prepare("SELECT * FROM tickets").all();
  res.json(tickets);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
