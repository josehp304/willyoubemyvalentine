# Testing Guide 🧪

## Testing the Full Flow Locally

### Step 1: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
You should see: "Server running on port 3000" and "Database initialized successfully"

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
You should see the local dev server URL (usually http://localhost:5173)

### Step 2: Create a Request (As User A)

1. Open http://localhost:5173 in your browser
2. Enter your name (e.g., "Alex")
3. Click "Load Dashboard" or "Create New Valentine Request"
4. Click "✨ Create New Valentine Request"
5. Fill in:
   - Your Name: "Alex"
   - Message: "Hey, will you be my Valentine? 💕"
6. Click "💝 Create Request"
7. Copy the generated link (should look like: http://localhost:5173/request/abc123xyz)

### Step 3: Respond to the Request (As User B)

1. Open a new **Incognito/Private window** (or different browser)
2. Paste the link you copied
3. You should see:
   - "💌 You have a Valentine Request!"
   - "From: Alex"
   - The message you wrote
4. Enter your name (e.g., "Jordan")
5. Click "💚 Yes, I'd love to!" (or "💔 No, thank you")
6. You should see "💚 Response Sent!" or "💔 Response Sent"

### Step 4: Check the Dashboard (Back to User A)

1. Go back to your original browser window
2. You should already be on the dashboard
3. If not, go to http://localhost:5173
4. You should see:
   - Your request listed
   - Status changed from "pending" to "accepted" or "declined"
   - The responder's name ("Jordan")
   - A green 💚 or red 💔 indicator

## Testing Multiple Requests

1. Create multiple requests with different messages
2. Each will get a unique ID and link
3. Share each link separately
4. All responses will show up on your dashboard

## Testing Edge Cases

### Test 1: Invalid Request ID
- Try visiting: http://localhost:5173/request/invalidid123
- Should show: "😢 Oops! Request not found"

### Test 2: Multiple Responses
- Try responding to the same request twice
- The first response is stored
- Subsequent visits should show "Response Sent" message

### Test 3: Empty Name
- Try creating a request without entering a name
- Should show validation error

### Test 4: No Message
- Try creating a request without a message
- Should show validation error

## API Testing with curl

### Create a Request:
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -d '{"creatorName":"TestUser","message":"Test message"}'
```

### Get Requests by Creator:
```bash
curl http://localhost:3000/api/requests/creator/TestUser
```

### Get a Specific Request:
```bash
curl http://localhost:3000/api/requests/REQUEST_ID_HERE
```

### Respond to a Request:
```bash
curl -X POST http://localhost:3000/api/requests/REQUEST_ID_HERE/respond \
  -H "Content-Type: application/json" \
  -d '{"response":"accepted","responderName":"TestResponder"}'
```

## Database Testing

You can check your Neon DB directly to see the data:

1. Go to https://neon.tech
2. Open your project
3. Go to "SQL Editor"
4. Run queries:

```sql
-- See all requests
SELECT * FROM valentine_requests;

-- See pending requests
SELECT * FROM valentine_requests WHERE response_status = 'pending';

-- See accepted requests
SELECT * FROM valentine_requests WHERE response_status = 'accepted';

-- Count by status
SELECT response_status, COUNT(*) 
FROM valentine_requests 
GROUP BY response_status;
```

## Common Issues & Solutions

### "Failed to fetch"
- ✅ Make sure backend is running on port 3000
- ✅ Check CORS is enabled in backend
- ✅ Check VITE_API_URL in frontend/.env

### "Database connection failed"
- ✅ Check DATABASE_URL in backend/.env
- ✅ Make sure Neon DB is accessible
- ✅ Verify connection string format

### "Request not found"
- ✅ Check the request ID is correct
- ✅ Verify request exists in database
- ✅ Check backend logs for errors

### Dashboard not loading
- ✅ Check browser console for errors
- ✅ Make sure you entered a name
- ✅ Verify API endpoints are working

## Performance Testing

Test with multiple requests:

```bash
# Create 10 requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/requests \
    -H "Content-Type: application/json" \
    -d "{\"creatorName\":\"User$i\",\"message\":\"Message $i\"}"
done
```

## Security Testing

✅ Test SQL injection protection (all queries use parameterized queries)
✅ Test XSS protection (React automatically escapes content)
✅ Test CORS (should only allow configured origins)

## Browser Compatibility

Test on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Mobile Testing

1. Find your computer's local IP address
2. Update frontend/.env: `VITE_API_URL=http://YOUR_IP:3000`
3. Rebuild frontend
4. Access from phone: `http://YOUR_IP:5173`

## Success Criteria

✅ Can create requests
✅ Can share links
✅ Links work in different browsers
✅ Responses are recorded
✅ Dashboard updates correctly
✅ All pages are mobile-responsive
✅ No console errors
✅ Database stores data correctly

Happy Testing! 🎉
