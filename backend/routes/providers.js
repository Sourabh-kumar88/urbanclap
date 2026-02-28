const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { auth, authorize } = require('../middleware/auth');

// Get all providers
router.get('/', async (req, res) => {
  try {
    const { category, search, serviceArea } = req.query;
    
    let query = {};
    
    if (category) {
      query.categories = category;
    }
    
    if (serviceArea) {
      query.serviceArea = { $regex: serviceArea, $options: 'i' };
    }

    const providers = await Provider.find(query)
      .populate('userId', 'name email phone location')
      .sort({ rating: -1 });

    // Filter by name if search provided
    let filteredProviders = providers;
    if (search) {
      filteredProviders = providers.filter(p => 
        p.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
      );
    }

    res.json(filteredProviders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get providers by category
router.get('/category/:category', async (req, res) => {
  try {
    const providers = await Provider.find({ categories: req.params.category })
      .populate('userId', 'name email phone location')
      .sort({ rating: -1 });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get provider by ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('userId', 'name email phone location');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Get reviews for this provider
    const reviews = await Review.find({ providerId: provider.userId._id })
      .populate('customerId', 'name')
      .sort({ createdAt: -1 });

    res.json({ provider, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current provider profile
router.get('/me/profile', auth, authorize('provider'), async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone location');
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create provider profile
router.post('/', auth, authorize('provider'), async (req, res) => {
  try {
    const { skills, experience, categories, availability, serviceArea, bio, hourlyRate } = req.body;

    // Check if provider profile already exists
    const existingProvider = await Provider.findOne({ userId: req.user._id });
    if (existingProvider) {
      return res.status(400).json({ message: 'Provider profile already exists' });
    }

    const provider = new Provider({
      userId: req.user._id,
      skills,
      experience,
      categories,
      availability,
      serviceArea,
      bio,
      hourlyRate
    });

    await provider.save();
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update provider profile
router.put('/:id', auth, authorize('provider'), async (req, res) => {
  try {
    const { skills, experience, categories, availability, serviceArea, bio, hourlyRate, profileImage } = req.body;

    const provider = await Provider.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    provider.skills = skills || provider.skills;
    provider.experience = experience || provider.experience;
    provider.categories = categories || provider.categories;
    provider.availability = availability || provider.availability;
    provider.serviceArea = serviceArea || provider.serviceArea;
    provider.bio = bio || provider.bio;
    provider.hourlyRate = hourlyRate || provider.hourlyRate;
    provider.profileImage = profileImage || provider.profileImage;

    await provider.save();
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get provider stats (for dashboard)
router.get('/me/stats', auth, authorize('provider'), async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });
    
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const totalBookings = await Booking.countDocuments({ providerId: req.user._id });
    const pendingBookings = await Booking.countDocuments({ providerId: req.user._id, status: 'pending' });
    const acceptedBookings = await Booking.countDocuments({ providerId: req.user._id, status: 'accepted' });
    const completedBookings = await Booking.countDocuments({ providerId: req.user._id, status: 'completed' });

    const reviews = await Review.find({ providerId: req.user._id });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
      : 0;

    res.json({
      totalBookings,
      pendingBookings,
      acceptedBookings,
      completedBookings,
      rating: avgRating.toFixed(1),
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify provider (admin only)
router.put('/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    res.json({ message: 'Provider verified', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all providers (admin)
router.get('/admin/all', auth, authorize('admin'), async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate('userId', 'name email phone location isActive');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
