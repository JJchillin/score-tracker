const express = require('express');
const Router = require('express-promise-router');
const path = require('path');
var bodyParser = require('body-parser');
const db = require('./db/index');
const app = express();

// Use bodyParser to parse jsons
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'cilent/build')));

// Get scores
app.get('/api/scores', async (req, res) => {
    const query = await db.query('SELECT * FROM players ORDER BY name;');
    res.send(query.rows);
});

// Add new player
app.post('/api/new-player', async (req, res) => {
    const { player } = req.body;
    const name = player[0];
    if (name.length >= 1) {
        await db.query('INSERT INTO players(name, score) VALUES ($1, 0);', [
            name
        ]);
    }
    res.json("Successfully posted ".concat(name));
});

// Increment player score
app.post('/api/add-player-score', async (req, res) => {
    const { player } = req.body;
    const name = player[0];
    await db.query('UPDATE players SET score = score + 1 WHERE name = $1;', [
        name
    ]);
    res.json("Successfully incremented score for ".concat(name));
});

// Decrement player score 
app.post('/api/subtract-player-score', async (req, res) => {
    const { player } = req.body;
    const name = player[0];
    await db.query('UPDATE players SET score = score -  1 WHERE name = $1;', [
        name
    ]);
    res.json("Successfully decremented score for ".concat(name));
});

// Delete player
app.post('/api/delete-player', async (req, res) => {
    const { player } = req.body;
    const name = player[0];
    await db.query('DELETE FROM players WHERE name = $1;', [
        name
    ]);
    res.json("You successfully deleted: ".concat(name));
})

//For any request that doesn't match, we'll send the index.html file from the cilent.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/cilent/build/index.html'));
});

// Set localhost port for server
const port = process.env.PORT || 5000;
app.listen(port);

console.log(`score tracker listening on ${port}`);