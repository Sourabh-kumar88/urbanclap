const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectDB() {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    // In production, require MONGODB_URI
    if (process.env.NODE_ENV === 'production') {
      if (!mongoUri) {
        console.error('MONGODB_URI environment variable is required in production');
        process.exit(1);
      }
      console.log('Connecting to MongoDB Atlas...');
    } else {
      // In development, allow in-memory server as fallback
      if (!mongoUri || mongoUri.includes('localhost')) {
        console.log('Starting in-memory MongoDB server...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
        console.log('In-memory MongoDB started at:', mongoUri);
      } else {
        console.log('Connecting to MongoDB Atlas...');
      }
    }
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected Successfully!');
    
    // Seed initial data for development
    await seedInitialData();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Seed initial data
async function seedInitialData() {
  const Service = require('./models/Service');
  const servicesCount = await Service.countDocuments();
  
  if (servicesCount === 0) {
    console.log('Seeding initial services...');
    const services = [
      { name: 'Electrician', description: 'Electrical repairs and installations', icon: '⚡' },
      { name: 'Plumber', description: 'Plumbing repairs and installations', icon: '🔧' },
      { name: 'Cleaner', description: 'Home and office cleaning services', icon: '🧹' },
      { name: 'Tutor', description: 'Academic tutoring and lessons', icon: '📚' },
      { name: 'Mechanic', description: 'Vehicle repair and maintenance', icon: '🔩' },
      { name: 'Carpenter', description: 'Woodwork and furniture repairs', icon: '🪚' },
      { name: 'Painter', description: 'Interior and exterior painting', icon: '🎨' },
      { name: 'Gardener', description: 'Garden maintenance and landscaping', icon: '🌱' }
    ];
    await Service.insertMany(services);
    console.log('Services seeded successfully');
  }
}

connectDB();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Local Service Marketplace API',
    status: 'Server is running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      providers: '/api/providers',
      services: '/api/services',
      bookings: '/api/bookings',
      reviews: '/api/reviews',
      health: '/api/health'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/providers', require('./routes/providers'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
