const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('./models/Service');
const User = require('./models/User');
const Provider = require('./models/Provider');

dotenv.config();

const services = [
  { name: 'Electrician', description: 'Electrical repairs and installations', icon: 'zap' },
  { name: 'Plumber', description: 'Plumbing repairs and installations', icon: 'droplet' },
  { name: 'Cleaner', description: 'Home and office cleaning services', icon: 'sparkles' },
  { name: 'Tutor', description: 'Academic tutoring and mentorship', icon: 'book-open' },
  { name: 'Mechanic', description: 'Vehicle repair and maintenance', icon: 'car' },
  { name: 'Painter', description: 'Interior and exterior painting', icon: 'paintbrush' },
  { name: 'Carpenter', description: 'Wood work and furniture repair', icon: 'hammer' },
  { name: 'Gardener', description: 'Landscaping and garden maintenance', icon: 'flower' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/local-service-marketplace');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await User.deleteMany({});
    await Provider.deleteMany({});

    // Create services
    await Service.insertMany(services);
    console.log('Services created');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890',
      location: 'New York'
    });
    await adminUser.save();
    console.log('Admin user created: admin@example.com / admin123');

    // Create sample customer
    const customerUser = new User({
      name: 'John Doe',
      email: 'customer@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '9876543210',
      location: 'Los Angeles'
    });
    await customerUser.save();
    console.log('Customer user created: customer@example.com / customer123');

    // Create sample providers
    const providers = [
      {
        name: 'Mike Johnson',
        email: 'provider1@example.com',
        password: 'provider123',
        role: 'provider',
        phone: '5551234567',
        location: 'New York',
        skills: ['Electrical Wiring', 'Circuit Repair', 'Installation'],
        experience: 10,
        categories: ['Electrician'],
        serviceArea: 'New York',
        bio: 'Licensed electrician with 10 years of experience in residential and commercial electrical work.',
        hourlyRate: 75,
        rating: 4.8,
        isVerified: true
      },
      {
        name: 'Sarah Williams',
        email: 'provider2@example.com',
        password: 'provider123',
        role: 'provider',
        phone: '5552345678',
        location: 'Los Angeles',
        skills: ['Home Cleaning', 'Office Cleaning', 'Deep Cleaning'],
        experience: 5,
        categories: ['Cleaner'],
        serviceArea: 'Los Angeles',
        bio: 'Professional cleaner with attention to detail. Certified in eco-friendly cleaning methods.',
        hourlyRate: 35,
        rating: 4.9,
        isVerified: true
      },
      {
        name: 'David Brown',
        email: 'provider3@example.com',
        password: 'provider123',
        role: 'provider',
        phone: '5553456789',
        location: 'Chicago',
        skills: ['Pipe Repair', 'Leak Detection', 'Water Heater Installation'],
        experience: 8,
        categories: ['Plumber'],
        serviceArea: 'Chicago',
        bio: 'Expert plumber offering 24/7 emergency services. All work guaranteed.',
        hourlyRate: 65,
        rating: 4.7,
        isVerified: true
      }
    ];

    for (const p of providers) {
      const user = new User({
        name: p.name,
        email: p.email,
        password: p.password,
        role: p.role,
        phone: p.phone,
        location: p.location
      });
      await user.save();

      const provider = new Provider({
        userId: user._id,
        skills: p.skills,
        experience: p.experience,
        categories: p.categories,
        serviceArea: p.serviceArea,
        bio: p.bio,
        hourlyRate: p.hourlyRate,
        rating: p.rating,
        totalReviews: Math.floor(Math.random() * 50) + 10,
        isVerified: p.isVerified,
        availability: 'available'
      });
      await provider.save();
    }
    console.log('Sample providers created');

    console.log('\n=== Seed Complete ===');
    console.log('Admin: admin@example.com / admin123');
    console.log('Customer: customer@example.com / customer123');
    console.log('Providers: provider1@example.com, provider2@example.com, provider3@example.com / provider123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
