// Importing express module
const express = require('express');
const cors = require('cors');

// Creating an instance of express
const app = express();

// Defining the port
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

app.use(cors());

// Define a simple GET route
const books = [
    { title: 'Book A', author: 'Author X', year: 2001 },
    { title: 'Book B', author: 'Author Y', year: 2005 },
    { title: 'Book C', author: 'Author X', year: 2010 },
  ];
  
  app.get('/books', (req, res) => {
    let filteredBooks = books;
  
    // Filter by author
    if (req.query.author) {
      filteredBooks = filteredBooks.filter(book => book.author === req.query.author);
    }
  
    // Sort by field
    if (req.query.sort) {
      filteredBooks.sort((a, b) => (a[req.query.sort] > b[req.query.sort]) ? 1 : -1);
    }
  
    res.json(filteredBooks);
  });
  
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
