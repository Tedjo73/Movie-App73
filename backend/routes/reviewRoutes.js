const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviewsSnapshot = await db.collection('reviews').orderBy('date', 'desc').get();
    const reviews = [];
    
    reviewsSnapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews by movie ID
router.get('/movie/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const reviewsSnapshot = await db.collection('reviews')
      .where('movieId', '==', parseInt(movieId))
      .orderBy('date', 'desc')
      .get();
    
    const reviews = [];
    reviewsSnapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    res.status(500).json({ error: 'Failed to fetch movie reviews' });
  }
});

// Get reviews by user
router.get('/user/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    const reviewsSnapshot = await db.collection('reviews')
      .where('userName', '==', userName)
      .orderBy('date', 'desc')
      .get();
    
    const reviews = [];
    reviewsSnapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// Create a new review
router.post('/', async (req, res) => {
  try {
    const { movieId, movieTitle, userName, rating, comment } = req.body;
    
    // Validation
    if (!movieId || !movieTitle || !userName || !rating || !comment) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (rating < 1 || rating > 10) {
      return res.status(400).json({ error: 'Rating must be between 1 and 10' });
    }
    
    const newReview = {
      movieId: parseInt(movieId),
      movieTitle,
      userName,
      rating: parseInt(rating),
      comment,
      date: new Date().toISOString()
    };
    
    const docRef = await db.collection('reviews').add(newReview);
    
    res.status(201).json({ id: docRef.id, ...newReview });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Update a review
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }
    
    if (rating < 1 || rating > 10) {
      return res.status(400).json({ error: 'Rating must be between 1 and 10' });
    }
    
    await db.collection('reviews').doc(id).update({
      rating: parseInt(rating),
      comment
    });
    
    const updatedDoc = await db.collection('reviews').doc(id).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('reviews').doc(id).delete();
    res.json({ message: 'Review deleted successfully', id });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;