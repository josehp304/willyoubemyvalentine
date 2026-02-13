# Valentine Request App - Project Summary

## 🎯 What You Got

A complete full-stack application where users can:
- Create personalized Valentine requests
- Get unique shareable links for each request
- Track all requests and responses in a dashboard
- Recipients can respond via the shared link (Yes/No)
- See who responded and their answer

## 📁 Project Structure

```
willyoubemyvalentine/
├── backend/                    # Node.js + Express + Neon DB
│   ├── src/
│   │   ├── db.ts              # Database connection & schema
│   │   └── index.ts           # Express server & API routes
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .env                   # ⚠️ Add your DATABASE_URL here
│
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── api.ts             # API client functions
│   │   ├── App.tsx            # Main router component
│   │   ├── Dashboard.tsx      # User dashboard page
│   │   ├── Dashboard.css
│   │   ├── CreateRequest.tsx  # Create request form
│   │   ├── CreateRequest.css
│   │   ├── RequestPage.tsx    # Public request page
│   │   ├── RequestPage.css
│   │   ├── ValentineGame.tsx  # Fun game (bonus!)
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── .env
│
├── README.md                   # Full documentation
├── QUICKSTART.md              # Quick setup guide
└── setup.sh                   # Automated setup script

```

## 🗄️ Database Schema (Neon DB)

```sql
valentine_requests
├── id (TEXT, PRIMARY KEY)           # Unique request ID
├── creator_name (TEXT)              # Person who created request
├── message (TEXT)                   # Valentine message
├── created_at (TIMESTAMP)           # When created
├── response_status (TEXT)           # 'pending', 'accepted', 'declined'
├── responder_name (TEXT)            # Who responded
└── responded_at (TIMESTAMP)         # When they responded
```

## 🔌 API Endpoints

### POST `/api/requests`
Create a new valentine request
```json
{
  "creatorName": "John",
  "message": "Will you be my Valentine?"
}
```

### GET `/api/requests/creator/:creatorName`
Get all requests by a creator

### GET `/api/requests/:id`
Get a specific request by ID (for the public link)

### POST `/api/requests/:id/respond`
Respond to a request
```json
{
  "response": "accepted", // or "declined"
  "responderName": "Jane"
}
```

## 🚀 Routes (Frontend)

- `/` - Dashboard (enter name to see your requests)
- `/create` - Create a new Valentine request
- `/request/:id` - Public request page (shareable link)
- `/game` - Fun Valentine's game

## ⚙️ Setup Steps

1. **Get Neon DB Connection String**
   - Sign up at https://neon.tech
   - Create a project
   - Copy your connection string

2. **Configure Backend**
   ```bash
   # Edit backend/.env
   DATABASE_URL=your_neon_connection_string_here
   PORT=3000
   ```

3. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on http://localhost:3000

4. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on http://localhost:5173

## 💡 How It Works

1. **User A** (Creator):
   - Goes to dashboard
   - Enters their name
   - Creates a Valentine request with a message
   - Gets a unique shareable link like: `http://localhost:5173/request/abc123xyz`

2. **User B** (Recipient):
   - Receives the link from User A
   - Opens the link
   - Sees the message
   - Enters their name
   - Clicks "Yes" or "No"

3. **User A** (Back to dashboard):
   - Refreshes dashboard
   - Sees the response status updated
   - Sees who responded and their answer

## 🎨 Features Included

- ✅ Full CRUD operations for requests
- ✅ Unique ID generation with nanoid
- ✅ Beautiful gradient UI with animations
- ✅ Mobile-responsive design
- ✅ Copy-to-clipboard functionality
- ✅ Local storage for remembering user names
- ✅ Real-time status updates
- ✅ TypeScript throughout
- ✅ Proper error handling
- ✅ CORS enabled for local development
- ✅ Bonus Valentine's game at `/game`

## 🔧 Technologies Used

**Backend:**
- Node.js & Express
- TypeScript
- Neon DB (PostgreSQL)
- @neondatabase/serverless
- nanoid (unique IDs)
- CORS middleware

**Frontend:**
- React 19
- TypeScript
- React Router DOM
- Vite
- CSS with animations

## 📝 Environment Variables

**Backend (.env):**
- `DATABASE_URL` - Your Neon DB connection string ⚠️ REQUIRED
- `PORT` - Server port (default: 3000)

**Frontend (.env):**
- `VITE_API_URL` - Backend URL (default: http://localhost:3000)

## 🚦 Next Steps

1. Add your Neon DB connection string to `backend/.env`
2. Start both servers (backend & frontend)
3. Test the flow locally
4. Customize the messages and styling if desired
5. Deploy to production when ready

## 🌐 Production Deployment Tips

- **Backend**: Deploy to Railway, Render, or similar
- **Frontend**: Deploy to Vercel, Netlify
- Update CORS settings for production domain
- Update `VITE_API_URL` to production backend URL
- Ensure environment variables are set in hosting platforms

## 💝 Have Fun!

This app is ready to use! Just add your database connection and you're good to go.
