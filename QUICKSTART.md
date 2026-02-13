# Quick Start Guide 🚀

## Get Your Neon DB Connection String

1. Go to https://neon.tech and sign up/login
2. Create a new project or use an existing one
3. Go to your project dashboard
4. Click "Connection Details"
5. Copy the connection string (starts with `postgresql://`)

## Start the App

### Terminal 1 - Backend
```bash
cd backend
# Edit .env and add your DATABASE_URL
npm run dev
```

The backend will start on http://localhost:3000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:5173

## How to Use

1. **Open** http://localhost:5173
2. **Enter your name** to load your dashboard
3. **Click "Create New Valentine Request"**
4. **Write your message** and create the request
5. **Copy the shareable link** and send it to your crush
6. **Wait for their response** - check your dashboard to see their answer!

## Testing Locally

To test the flow:
1. Create a request in one browser
2. Copy the shareable link
3. Open it in an incognito/private window
4. Respond as the recipient
5. Go back to the dashboard to see the response

## Troubleshooting

**Backend won't start?**
- Make sure you added your DATABASE_URL in `backend/.env`
- Check if port 3000 is available

**Frontend can't connect?**
- Make sure backend is running
- Check that VITE_API_URL in `frontend/.env` matches your backend URL

**Database errors?**
- Verify your Neon DB connection string is correct
- Make sure your Neon DB is running and accessible

## Have Fun! 💝

Remember: This is meant to be a fun way to ask someone to be your Valentine!
