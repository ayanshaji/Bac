const router = express.Router();
const Review = require('../models/Review');

// GET all reviews for a specific book
router.get('/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// POST a new review
router.post('/', async (req, res) => {
  const { bookId, reviewer, rating, comment } = req.body;

  if (!bookId || !reviewer || !rating || !comment) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newReview = new Review({ bookId, reviewer, rating, comment });
    await newReview.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review' });
  }
});

module.exports = router;