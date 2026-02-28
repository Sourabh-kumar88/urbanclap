const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');
const { auth, authorize } = require('../middleware/auth');

// Create booking
router.post('/', auth, authorize('customer'), async (req, res) => {
  try {
    const { providerId, serviceId, description, date, time, location, price, notes } = req.body;

    // Check if this is an open job (no specific provider selected)
    const isOpenJob = !providerId || providerId === '';

    const booking = new Booking({
      customerId: req.user._id,
      providerId: isOpenJob ? null : providerId,
      serviceId,
      description,
      date,
      time,
      location,
      price,
      notes,
      status: 'pending',
      isOpenJob
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get customer bookings
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    // Only allow users to view their own bookings
    if (req.user._id.toString() !== req.params.customerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ customerId: req.params.customerId })
      .populate('providerId', 'name email phone')
      .populate('serviceId', 'name')
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get provider bookings
router.get('/provider/:providerId', auth, async (req, res) => {
  try {
    // Only allow providers to view their own bookings
    if (req.user._id.toString() !== req.params.providerId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ providerId: req.params.providerId })
      .populate('customerId', 'name email phone location')
      .populate('serviceId', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings (admin)
router.get('/admin/all', auth, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('providerId', 'name email')
      .populate('serviceId', 'name')
      .populate('customerId', 'name email location')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('providerId', 'name email phone')
      .populate('serviceId', 'name')
      .populate('customerId', 'name email phone location');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    if (booking.customerId._id.toString() !== req.user._id.toString() &&
        booking.providerId._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const isCustomer = booking.customerId.toString() === req.user._id.toString();
    const isProvider = booking.providerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Validate status transitions
    if (isProvider) {
      if (!['accepted', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status for provider' });
      }
    }

    if (isCustomer) {
      if (status !== 'cancelled') {
        return res.status(400).json({ message: 'Customer can only cancel bookings' });
      }
    }

    booking.status = status;
    if (notes) {
      booking.notes = notes;
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const isCustomer = booking.customerId.toString() === req.user._id.toString();
    const isProvider = booking.providerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
