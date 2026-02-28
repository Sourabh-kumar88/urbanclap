# Deployment Guide for ServiceHub

This guide explains how to deploy ServiceHub to production.

## Architecture

| Component | Platform | Cost |
|-----------|----------|------|
| Frontend | Vercel or Netlify | Free |
| Backend | Render.com or Railway | Free tier |
| Database | MongoDB Atlas | Free (512MB) |

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (choose FREE tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://...`)
6. Replace `<password>` with your database user password

---

## Step 2: Deploy Backend to Render.com

1. Go to [Render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `servicehub-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a random secure string (e.g., generate at https://randomkeygen.com)
   - `NODE_ENV` = `production`
6. Click "Create Web Service"
7. Wait for deployment (takes ~5 minutes)
8. Copy your backend URL (e.g., `https://servicehub-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
5. Add Environment Variables:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`
6. Click "Deploy"
7. Your app will be live at `https://your-app.vercel.app`

### Alternative: Deploy to Netlify

1. Go to [Netlify](https://netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
5. Add Environment Variables:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`
6. Click "Deploy"

---

## Step 4: Update CORS (if needed)

If you get CORS errors, update `backend/server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

---

## Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/servicehub
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## Free Tier Limitations

| Service | Limitation |
|---------|------------|
| Render.com | Spins down after 15 mins inactivity (cold start ~30s) |
| MongoDB Atlas | 512MB storage |
| Vercel | 100GB bandwidth/month |
| Netlify | 100GB bandwidth/month |

---

## Troubleshooting

### Backend not responding
- Check Render.com logs for errors
- Verify MONGODB_URI is correct
- Ensure JWT_SECRET is set

### Frontend API errors
- Verify REACT_APP_API_URL matches your backend URL
- Check browser console for CORS errors
- Ensure backend is running (visit backend URL directly)

### Data not persisting
- Verify MongoDB Atlas connection string
- Check that MONGODB_URI doesn't contain `localhost`

---

## Quick Deploy Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Connection string copied
- [ ] Backend deployed to Render.com
- [ ] Backend environment variables set
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Frontend REACT_APP_API_URL set to backend URL
- [ ] Test: Can register/login
- [ ] Test: Can create bookings
