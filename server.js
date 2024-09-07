const express = require('express');
const path = require('path');
const app = express();
const port = 4000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// For any other routes, try to send the corresponding HTML file
app.use((req, res, next) => {
    const filePath = path.join(__dirname, req.url);
    res.sendFile(filePath, (err) => {
        if (err && err.code === 'ENOENT') {
            // If the file doesn't exist, move to the next middleware
            next();
        } else if (err) {
            // For other errors, send a 500 error
            res.status(500).send('Internal Server Error');
        }
    });
});

// If no file is found, send a 404 error
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});