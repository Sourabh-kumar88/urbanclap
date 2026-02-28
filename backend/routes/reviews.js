const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const { auth, authorize } = require('../middleware/auth');

// Create review
router.post('/', auth, authorize('customer'), async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Already reviewed this booking' });
    }

    const review = new Review({
      bookingId,
      customerId: req.user._id,
      providerId: booking.providerId,
      rating,
      comment
    });

    await review.save();

    // Update provider rating
    const reviews = await Review.find({ providerId: booking.providerId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    
    await Provider.findOneAndUpdate(
      { userId: booking.providerId },
      { 
        rating: avgRating.toFixed(1),
        totalReviews: reviews.length
      }
    );

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get provider reviews
router.get('/provider/:providerId', async (req, res) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer reviews
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    // Only allow users to view their own reviews
    if (req.user._id.toString() !== req.params.customerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const reviews = await Review.find({ customerId: req.params.customerId })
      .populate('providerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reviews (admin)
router.get('/admin/all', auth, authorize('admin'), async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if booking is reviewed
router.get('/booking/:bookingId', auth, async (req, res) => {
  try {
    const review = await Review.findOne({ bookingId: req.params.bookingId });
    res.json({ reviewed: !!review, review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
