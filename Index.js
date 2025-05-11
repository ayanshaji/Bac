const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const getResponse = require('./chatbot');

require('./Connection');
const userModel = require('./Model/User');
const bookModel = require('./Model/book');
const reviewModel = require('./Model/review'); // ✅ REQUIRED
 // 👈 NEW

// initialize
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Predefined admin credentials
const admins = [
  { username: 'allenjoshy', password: 'allenjoshy@14' },
  { username: 'anvarshas', password: 'anvarshas@24' },
  { username: 'arjunpsuresh', password: 'arjunpsuresh@26' },
  { username: 'ayanshaji', password: 'ayanshaji@32' }
];

// 1. Register API (Sign-in)
app.post('/sign', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            password: hashedPassword,
        });

        await newUser.save();
        res.send({ message: 'User registered successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error during registration' });
    }
});

// 2. Login API
app.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (role === 'admin') {
            const admin = admins.find((admin) => admin.username === username && admin.password === password);
            if (admin) {
                return res.send({ message: 'Admin login successful', username });
            } else {
                return res.status(400).send({ message: 'Invalid admin credentials' });
            }
        }

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid password' });
        }

        res.send({ message: 'Login successful', username: user.username });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error during login' });
    }
});

// 📚 Get all books
app.get('/books', async (req, res) => {
    try {
        const books = await bookModel.find();
        res.json(books);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching books' });
    }
});

// 📚 Borrow a book
app.post('/borrow', async (req, res) => {
    try {
        const { bookId, borrower } = req.body;
        const now = new Date().toLocaleDateString();

        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).send({ message: 'Book not found' });
        }

        if (book.borrowed) {
            return res.status(400).send({ message: 'Book already borrowed' });
        }

        book.borrowed = true;
        book.borrowedBy = borrower;
        book.borrowDate = now;
        await book.save();

        res.send({ message: 'Book borrowed successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error borrowing book' });
    }
});

// 📚 Return a book
app.post('/return', async (req, res) => {
    try {
        const { bookId } = req.body;

        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).send({ message: 'Book not found' });
        }

        book.borrowed = false;
        book.borrowedBy = '';
        book.borrowDate = '';
        await book.save();

        res.send({ message: 'Book returned successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error returning book' });
    }
});

// 💬 Chatbot API
app.post('/chatbot', (req, res) => {
    const { message } = req.body;
    const reply = getResponse(message);
    res.json({ reply });
});

//review

app.get('/reviews/:bookId', async (req, res) => {
    try {
      const reviews = await reviewModel.find({ bookId: req.params.bookId });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
  });
  
  app.post('/reviews', async (req, res) => {
    const { bookId, reviewer, rating, comment } = req.body;
  
    if (!bookId || !reviewer || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const newReview = new reviewModel({ bookId, reviewer, rating, comment });
      await newReview.save();
      res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add review' });
    }
  });

// Health Check
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// port setting
app.listen(3004, () => {
    console.log('Port is running on 3004');
});
