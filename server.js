const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from 'assets' directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/submit-form', async (req, res) => {
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

// Helper function to save form submission (implementation needed)
async function saveFormSubmission(formData) {
  // Implement the logic to save form data
  // This could involve database operations or other data storage methods
  console.log('Form data received:', formData);
  // For now, we'll just return a resolved promise
  return Promise.resolve();
}
