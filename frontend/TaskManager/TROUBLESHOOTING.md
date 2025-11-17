# Troubleshooting Guide

## "Failed to fetch" Error

If you're seeing a "Failed to fetch" error when trying to sign up or sign in, follow these steps:

### 1. Check if Backend Server is Running

Make sure the backend server is running on port 5000:

```bash
cd backend
npm start
# or
node server.js
```

You should see: `Server is running on 5000`

### 2. Check MongoDB Connection

Ensure MongoDB is running and the connection string is correct in `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
```

### 3. Verify Backend Endpoints

Test if the backend is accessible by opening in your browser:
- http://localhost:5000/api/auth/register (should return an error about missing data, not "Failed to fetch")

### 4. Check CORS Configuration

The backend should have CORS enabled. Check `backend/server.js` - it should allow all origins with `origin: "*"`.

### 5. Check Frontend API URL

In the browser console, you should see: `API Base URL: http://localhost:5000/api`

If it's different, create a `.env` file in `frontend/TaskManager/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then restart the frontend dev server.

### 6. Check Browser Console

Open browser DevTools (F12) and check:
- Console tab for any errors
- Network tab to see if the request is being made and what the response is

### 7. Common Issues

**Issue**: Backend server not running
- **Solution**: Start the backend server first

**Issue**: Wrong port
- **Solution**: Make sure backend is on port 5000, or update `VITE_API_URL` in frontend `.env`

**Issue**: MongoDB not connected
- **Solution**: Check MongoDB connection string and ensure MongoDB is running

**Issue**: Firewall blocking connection
- **Solution**: Check if firewall is blocking localhost:5000

### Quick Test

1. Open terminal and run:
```bash
curl http://localhost:5000/api/auth/register -X POST -H "Content-Type: application/json" -d '{"name":"test","email":"test@test.com","password":"test123"}'
```

If this works, the backend is fine and the issue is with the frontend connection.

