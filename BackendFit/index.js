import express from 'express';
import cors from 'cors';
import users from "./user.js";

const app = express();

// 1. Middleware (Must come before routes)
app.use(cors()); 
app.use(express.json());

// 2. Routes
app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.get("/api/user", (req, res) => {
    res.send(users);
});

// This is the route your HTML form is looking for
app.post('/register', (req, res) => {
    const { username, email, password } = req.body; 
    
    // Check if the data is coming through in your terminal
    console.log("Received data:", req.body);

    // TODO: Add your MySQL INSERT logic here

    // This matches what your frontend needs:
    res.status(200).json({ 
        success: true, 
        message: "Registration successful!" 
    });
});
// Add this to your index.js
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email);

    // After you verify the user in MySQL:
    res.status(200).json({ 
        success: true, 
        message: "Login successful!" 
    });
});
// 3. Start Server (Only call this ONCE)
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});