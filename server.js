const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from 'assets' directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DATABASE_FILE = path.join(__dirname, 'submissions.txt');

async function saveFormSubmission(data) {
  const timestamp = new Date().toISOString();
  const formattedData = `${timestamp}\n${JSON.stringify(data)}\n\n`;

  try {
    // Check if the file exists
    await fs.access(DATABASE_FILE);
    console.log('Database file exists');
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it
      await fs.writeFile(DATABASE_FILE, '');
      console.log('Database file created');
    } else {
      console.error('Error checking database file:', error);
      throw error;
    }
  }

  try {
    // Append the new submission to the existing file
    await fs.appendFile(DATABASE_FILE, formattedData);
    console.log('Submission saved successfully');
  } catch (error) {
    console.error('Error saving submission:', error);
    throw error;
  }

  // Log the current working directory and the full path of the database file
  console.log('Current working directory:', process.cwd());
  console.log('Full path of database file:', path.resolve(DATABASE_FILE));
}

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/services', (req, res) => {
  res.render('services');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

// Updated routes for Terms of Service and Privacy Policy
app.get('/terms-of-service', (req, res) => {
  res.render('Terms_of_Service');
});

app.get('/privacy-policy', (req, res) => {
  res.render('Privacy_Policy');
});

app.post('/submit-contact', async (req, res) => {
  try {
    await saveFormSubmission(req.body);
    res.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({ success: false, message: 'Error saving submission' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
