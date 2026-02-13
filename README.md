# Will You Be My Valentine? 💝

A full-stack Valentine's Day request application where users can create and share unique Valentine requests with shareable links, and track responses in a personal dashboard.

## Features

- 💌 **Create Valentine Requests**: Users can create personalized Valentine messages
- 🔗 **Shareable Links**: Each request gets a unique shareable link
- 📊 **Dashboard**: Track all your requests and see responses
- ✅ **Accept/Decline**: Recipients can respond via the shared link
- 🎮 **Fun Game**: Includes a playful Valentine's game at `/game`

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Neon DB (PostgreSQL)
- nanoid for unique IDs

### Frontend
- React 19 + TypeScript
- React Router for navigation
- Vite for build tooling
- CSS for styling

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Neon DB account and database (sign up at https://neon.tech)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Add your Neon DB connection string to `.env`:
   ```
   DATABASE_URL=postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
   PORT=3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3000` and automatically create the required database tables on startup.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy).

## Usage

1. **Create a Request**:
   - Go to the dashboard at `/`
   - Enter your name
   - Click "Create New Valentine Request"
   - Write your message
   - Get a unique shareable link

2. **Share the Link**:
   - Copy the generated link
   - Send it to your crush via text, email, or social media

3. **Recipient Responds**:
   - They click the link
   - Enter their name
   - Click "Yes" or "No"

4. **Check Dashboard**:
   - Return to your dashboard
   - See all responses with names and status

## API Endpoints

- `POST /api/requests` - Create a new valentine request
- `GET /api/requests/creator/:creatorName` - Get all requests by creator
- `GET /api/requests/:id` - Get a specific request
- `POST /api/requests/:id/respond` - Respond to a request

## Database Schema

```sql
CREATE TABLE valentine_requests (
  id TEXT PRIMARY KEY,
  creator_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_status TEXT DEFAULT 'pending',
  responder_name TEXT,
  responded_at TIMESTAMP
);
```

## Routes

- `/` - Dashboard
- `/create` - Create new request
- `/request/:id` - Public request page
- `/game` - Fun Valentine's game

## Development

### Backend
```bash
cd backend
npm run dev  # Run with hot reload
npm run build  # Build for production
npm start  # Run production build
```

### Frontend
```bash
cd frontend
npm run dev  # Run with hot reload
npm run build  # Build for production
npm run preview  # Preview production build
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - Neon DB connection string (required)
- `PORT` - Server port (default: 3000)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

## Production Deployment

1. Set up your Neon DB database in production
2. Deploy backend to your hosting service (Railway, Render, etc.)
3. Update frontend `VITE_API_URL` to point to production backend
4. Deploy frontend to Vercel, Netlify, or similar
5. Ensure CORS is properly configured in production

## License

MIT
