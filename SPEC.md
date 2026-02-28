# Local Service Marketplace - Technical Specification

## Project Overview
- **Project Name**: Local Service Marketplace
- **Type**: Full-stack Web Application
- **Core Functionality**: Connects customers with independent local service providers
- **Target Users**: Customers seeking services, Service Providers, Admin

## Tech Stack
- **Frontend**: React.js with React Router
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based with bcrypt password hashing

## Color Palette
- Primary: #000000 (Black)
- Secondary: #FFFFFF (White)
- Background: #F8F9FA (Light Grey)
- Surface: #FFFFFF (White)
- Border: #E5E5E5 (Light Grey)
- Text Primary: #1A1A1A
- Text Secondary: #6B7280
- Accent: #374151 (Dark Grey)
- Success: #10B981
- Error: #EF4444
- Warning: #F59E0B

## Typography
- Primary Font: 'Inter', sans-serif
- Headings: 600-700 weight
- Body: 400-500 weight

## User Roles
1. **Customer**: Can search, book, review services
2. **Provider**: Can manage profile, accept jobs, update status
3. **Admin**: Full system control

## Database Collections

### Users
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ['customer', 'provider', 'admin'],
  phone: String,
  location: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Providers
```
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  skills: [String],
  experience: Number,
  categories: [String],
  availability: String,
  rating: Number,
  isVerified: Boolean,
  serviceArea: String,
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Services
```
{
  _id: ObjectId,
  name: String,
  description: String,
  icon: String,
  createdAt: Date
}
```

### Bookings
```
{
  _id: ObjectId,
  customerId: ObjectId (ref: Users),
  providerId: ObjectId (ref: Users),
  serviceId: ObjectId (ref: Services),
  description: String,
  date: Date,
  time: String,
  status: String ['pending', 'accepted', 'completed', 'cancelled'],
  location: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews
```
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Bookings),
  customerId: ObjectId (ref: Users),
  providerId: ObjectId (ref: Users),
  rating: Number (1-5),
  comment: String,
  createdAt: Date
}
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Users
- GET /api/users/:id - Get user profile
- PUT /api/users/:id - Update user profile
- GET /api/users - Get all users (admin)

### Providers
- GET /api/providers - Get all providers
- GET /api/providers/:id - Get provider details
- POST /api/providers - Create provider profile
- PUT /api/providers/:id - Update provider profile
- GET /api/providers/category/:category - Get providers by category

### Services
- GET /api/services - Get all services
- POST /api/services - Create service (admin)
- PUT /api/services/:id - Update service
- DELETE /api/services/:id - Delete service

### Bookings
- POST /api/bookings - Create booking
- GET /api/bookings/customer/:customerId - Get customer bookings
- GET /api/bookings/provider/:providerId - Get provider bookings
- PUT /api/bookings/:id - Update booking status
- DELETE /api/bookings/:id - Cancel booking

### Reviews
- POST /api/reviews - Create review
- GET /api/reviews/provider/:providerId - Get provider reviews

## Pages

### Frontend Pages
1. **Home Page** (`/`) - Landing page with service categories
2. **Login** (`/login`) - User login
3. **Register** (`/register`) - User registration
4. **Customer Dashboard** (`/customer/dashboard`) - Customer home
5. **Provider Dashboard** (`/provider/dashboard`) - Provider home
6. **Admin Dashboard** (`/admin/dashboard`) - Admin home
7. **Services** (`/services`) - Browse services
8. **Providers** (`/providers`) - Browse providers
9. **Provider Profile** (`/providers/:id`) - Provider details
10. **Book Service** (`/book/:providerId`) - Book a provider
11. **My Bookings** (`/bookings`) - View bookings
12. **Post Job** (`/post-job`) - Post a job request
13. **Reviews** (`/reviews`) - View/write reviews
14. **Provider Settings** (`/provider/settings`) - Manage profile

## Security
- JWT tokens with 7-day expiry
- Password hashing with bcrypt
- Protected routes based on roles
- Input validation on all forms
- CORS configuration

## Acceptance Criteria
- [ ] Users can register with role selection
- [ ] JWT authentication works correctly
- [ ] Customers can browse and search providers
- [ ] Customers can book providers
- [ ] Providers can manage their profile
- [ ] Providers can accept/reject jobs
- [ ] Status updates work correctly
- [ ] Reviews can be submitted
- [ ] Admin can manage users and verify providers
- [ ] Responsive design works on mobile
- [ ] Black/white minimalist UI applied
