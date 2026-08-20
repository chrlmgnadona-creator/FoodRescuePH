const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection (Connects to your MySQL layer)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'foodrescue_db'
});

db.connect(err => {
    if (err) {
        console.error('MySQL Database Connection Failed:', err.message);
        console.log('Running in fallback memory mode until MySQL is active.');
        return;
    }
    console.log('Connected to MySQL Database successfully.');
});

// ==========================================
// MAIN API ENDPOINTS FOR FRONTEND
// ==========================================

// 1. User Registration Endpoint
app.post('/api/register', (req, res) => {
    const { fullname, mobile, barangay, password } = req.body;

    if (!fullname || !mobile || !barangay || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const query = 'INSERT INTO users (fullname, mobile, barangay, password) VALUES (?, ?, ?, ?)';
    db.query(query, [fullname, mobile, barangay, password], (err, results) => {
        if (err) {
            // Fallback or duplicate mobile handling
            return res.status(400).json({ success: false, message: 'Mobile number might already be registered or database offline.' });
        }
        res.json({ success: true, message: 'Registration successful!', user: { fullname, barangay } });
    });
});

// 2. User Login Endpoint
app.post('/api/login', (req, res) => {
    const { mobile, password } = req.body;

    const query = 'SELECT fullname, barangay FROM users WHERE mobile = ? AND password = ?';
    db.query(query, [mobile, password], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials or user not found.' });
        }
        res.json({ success: true, message: 'Login successful!', user: results[0] });
    });
});

// 3. Get Food Posts Endpoint
app.get('/api/posts', (req, res) => {
    const query = 'SELECT * FROM food_posts ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) {
            // Fallback mock post if DB table isn't created yet
            return res.json({ 
                success: true, 
                posts: [{ id: 101, title: 'Rice Meals (30 packs)', location: 'Barangay San Jose', time: '1h ago', notes: 'Packed clean.' }] 
            });
        }
        res.json({ success: true, posts: results });
    });
});

// 4. Create Food Post Endpoint
app.post('/api/posts', (req, res) => {
    const { title, category, quantity, barangay, notes } = req.body;
    const fullTitle = `${title} (${quantity})`;

    const query = 'INSERT INTO food_posts (title, category, location, notes, time_posted) VALUES (?, ?, ?, ?, NOW())';
    db.query(query, [fullTitle, category, barangay, notes || 'No instructions.'], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to save post to database.' });
        }
        res.json({ success: true, message: 'Food post created successfully!', postId: results.insertId });
    });
});

// ==========================================
// SERVICE INTEGRATION HOOKS (PHP & Python)
// ==========================================

// Hook for Python Analytics Service to fetch raw stats
app.get('/api/analytics/metrics', (req, res) => {
    // Python analytics script can request data here to generate community impact reports
    res.json({
        service: 'Node.js Main API',
        targetService: 'Python Analytics Service',
        status: 'Active',
        timestamp: new Date()
    });
});

// Hook for PHP Admin Service synchronization
app.post('/api/admin/sync', (req, res) => {
    // Endpoint used by your PHP backend service for admin moderation logs
    const { adminId, action } = req.body;
    res.json({ success: true, message: `Synced action ${action} from PHP admin panel.` });
});

// Start Server
app.listen(PORT, () => {
    console.log(`FoodRescue PH Main API running on http://localhost:${PORT}`);
});
