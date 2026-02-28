# Local Service Marketplace

A full-stack web application that connects customers with independent local service providers.

## Features

- **User Authentication**: JWT-based registration and login with role selection (Customer, Provider, Admin)
- **Service Categories**: Browse services like Electrician, Plumber, Cleaner, Tutor, Mechanic, etc.
- **Provider Profiles**: View provider ratings, experience, skills, and reviews
- **Booking System**: Book services instantly with date/time selection
- **Job Posting**: Customers can post job requests with descriptions
- **Status Tracking**: Track booking status (Pending, Accepted, Completed, Cancelled)
- **Rating & Reviews**: Rate and review service providers
- **Role-based Dashboards**: Separate dashboards for Customers, Providers, and Admins
- **Admin Panel**: Manage users, verify providers, handle bookings

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with black/white minimalist design

## Project Structure

```
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js       # Main server file
│   ├── seed.js         # Database seeder
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/    # Auth context
│   │   ├── pages/      # Page components
│   │   ├── App.js      # Main app component
│   │   └── App.css     # Styles
│   ├── public/
│   └── package.json
│
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```
bash
cd local-service-marketplace
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```
env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/local-service-marketplace
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

### 4. Seed the Database (Optional)

```
bash
cd backend
node seed.js
```

This will create sample data including:
- Admin user: admin@example.com / admin123
- Customer: customer@example.com / customer123
- Providers: provider1@example.com, provider2@example.com, provider3@example.com / provider123

### 5. Start the Backend

```
bash
cd backend
npm run dev
```

The server will start on http://localhost:5000

### 6. Frontend Setup

Open a new terminal:

```
bash
cd frontend
npm install
npm start
```

The frontend will start on http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Users
- GET `/api/users` - Get all users (admin)
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- PUT `/api/users/:id/deactivate` - Deactivate user (admin)
- PUT `/api/users/:id/activate` - Activate user (admin)

### Providers
- GET `/api/providers` - Get all providers
- GET `/api/providers/:id` - Get provider details
- GET `/api/providers/category/:category` - Get providers by category
- POST `/api/providers` - Create provider profile
- PUT `/api/providers/:id` - Update provider profile
- GET `/api/providers/me/stats` - Get provider stats
- PUT `/api/providers/:id/verify` - Verify provider (admin)

### Services
- GET `/api/services` - Get all services
- POST `/api/services` - Create service (admin)
- PUT `/api/services/:id` - Update service
- DELETE `/api/services/:id` - Delete service

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings/customer/:id` - Get customer bookings
- GET `/api/bookings/provider/:id` - Get provider bookings
- GET `/api/bookings/admin/all` - Get all bookings (admin)
- PUT `/api/bookings/:id` - Update booking status
- DELETE `/api/bookings/:id` - Cancel booking

### Reviews
- POST `/api/reviews` - Create review
- GET `/api/reviews/provider/:id` - Get provider reviews
- GET `/api/reviews/booking/:id` - Check if booking is reviewed

## User Roles & Permissions

### Customer
- Browse and search providers
- Book services
- Post job requests
- View booking history
- Rate and review providers

### Provider
- Create and manage profile
- View incoming booking requests
- Accept or reject jobs
- Update job status
- View ratings and reviews

### Admin
- Manage all users
- Verify provider accounts
- Manage service categories
- View all bookings
- Handle user deactivation

## Screenshots

The application features a clean, minimalist black and white design with:
- Modern dashboard-style layouts
- Responsive design for mobile and desktop
- Subtle hover effects
- Rounded corners and soft shadows

## License

MIT License
