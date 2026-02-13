import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sql, initializeDatabase } from './db.js';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import { authenticateToken, generateToken, type AuthRequest } from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Initialize database on startup
initializeDatabase().catch(console.error);

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING id, email, name
    `;

    const user = result[0];
    const token = generateToken(user.id, user.email);

    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await sql`
      SELECT id, email, name, password_hash FROM users
      WHERE email = ${email}
    `;

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);

    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user (protected route)
app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await sql`
      SELECT id, email, name FROM users
      WHERE id = ${req.userId}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create a new valentine request (now protected)
app.post('/api/requests', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { message, recipientName } = req.body;
    
    if (!message || !recipientName) {
      return res.status(400).json({ error: 'Message and recipient name are required' });
    }

    // Get user info
    const userResult = await sql`
      SELECT name FROM users WHERE id = ${req.userId}
    `;
    
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const creatorName = userResult[0].name;
    const id = nanoid(10); // Generate unique ID
    
    await sql`
      INSERT INTO valentine_requests (id, user_id, creator_name, recipient_name, message)
      VALUES (${id}, ${req.userId}, ${creatorName}, ${recipientName}, ${message})
    `;

    res.json({ 
      id, 
      creatorName,
      recipientName,
      message,
      shareUrl: `${req.protocol}://${req.get('host')}/request/${id}`
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Get all requests created by the authenticated user
app.get('/api/requests', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const requests = await sql`
      SELECT * FROM valentine_requests
      WHERE user_id = ${req.userId}
      ORDER BY created_at DESC
    `;

    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get all requests created by a user (legacy - keeping for backward compatibility)
app.get('/api/requests/creator/:creatorName', async (req, res) => {
  try {
    const { creatorName } = req.params;
    
    const requests = await sql`
      SELECT * FROM valentine_requests
      WHERE creator_name = ${creatorName}
      ORDER BY created_at DESC
    `;

    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get a specific request by ID (for the public link)
app.get('/api/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await sql`
      SELECT id, creator_name, message, response_status, responder_name
      FROM valentine_requests
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Respond to a valentine request
app.post('/api/requests/:id/respond', async (req, res) => {
  try {
    const { id } = req.params;
    const { response, responderName } = req.body;

    if (!response || !responderName) {
      return res.status(400).json({ error: 'Response and responder name are required' });
    }

    const result = await sql`
      UPDATE valentine_requests
      SET response_status = ${response},
          responder_name = ${responderName},
          responded_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error responding to request:', error);
    res.status(500).json({ error: 'Failed to respond to request' });
  }
});

app.get('/health',(req,res)=>{
  try{
    return res.status(200).json({message:"server is working fine"})
  }catch{
    return res.status(500).json({message:"server not working oopsies"})
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


