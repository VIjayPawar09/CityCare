const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

connectDB();

app.use(cors({
  origin: 'http://localhost:5173', // must match frontend
  credentials: true, // allow credentials like cookies
}));
app.use(express.json());

// Mock "database" in memory for demo
let users = [
  { id: 1, username: 'admin', role: 'admin', password: 'admin123' },
  { id: 2, username: 'citizen1', role: 'citizen', password: 'citizen123' },
  { id: 3, username: 'volunteer1', role: 'volunteer', password: 'volunteer123' }
];

let issues = [
  // sample issue
  {
    id: 1,
    title: 'Pothole on main street',
    description: 'Huge pothole near market',
    status: 'pending',
    userId: 2,
  }
];

// --- Auth routes ---

app.post('/api/auth/register', async (req, res) => {
  const {name, email, password} = req.body;
 
     try {
         const userExists = await User.findOne({email});
         console.log("User exists", userExists);
         if(userExists) return res.status(400).json({message: 'User already exits'});
 
         const hasedPassword = await bcrypt.hash(password, 10);
 
         const user = new User({name, email, password: hasedPassword});
         await user.save();
 
         res.status(201).json({message: "user registered successfully"});
     } catch(err){
         res.status(500).json({message:err.message})
     }
});

app.post('/api/auth/login', async(req, res) => {
   const {email, password} = req.body;
  
      try{
          const user = await User.findOne({email});
          if(!user) return res.status(404).json({message: 'User not found'});
  
          const isMatch = await bcrypt.compare(password, user.password);
          console.log(isMatch);
          if(!isMatch) return res.status(401).json({message: 'Invalid credentials'});
          
  
          const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {
              expiresIn: '1d',
          });
  
          res.json({token, user: {id:user._id, name:user.name}});
      } catch(err){
        console.log(err.message);
          res.status(500).json({message: err.message});
      }
});

// --- Issues routes ---

// Get all issues (admin)
app.get('/api/issues', (req, res) => {
  res.json(issues);
});

// Get issues created by logged-in user (citizen or volunteer)
app.get('/api/issues/my-issues', (req, res) => {
  // For demo, get userId from query param (replace with auth in real app)
  const userId = parseInt(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const userIssues = issues.filter(issue => issue.userId === userId);
  res.json(userIssues);
});

// Create new issue (citizen)
app.post('/api/issues', (req, res) => {
  const { title, description, userId } = req.body;
  if (!title || !description || !userId) return res.status(400).json({ error: 'Missing fields' });

  const newIssue = {
    id: issues.length + 1,
    title,
    description,
    status: 'pending',
    userId,
  };
  issues.push(newIssue);
  res.json({ message: 'Issue reported successfully', issue: newIssue });
});

// Update issue status (admin or volunteer)
app.put('/api/issues/:id/status', (req, res) => {
  const issueId = parseInt(req.params.id);
  const { status } = req.body;
  const issue = issues.find(i => i.id === issueId);
  if (!issue) return res.status(404).json({ error: 'Issue not found' });

  issue.status = status;
  res.json({ message: 'Issue status updated', issue });
});

// Server listen
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
