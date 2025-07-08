import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Update if needed
  password: "Renuvnr@4578", // Update with your MySQL password
  database: "fitzeal", // Update with your database name
});

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("Fitzeal backend is running!");
});

// User Registration route
app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    db.query(query, [username, hashedPassword, email], (err) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
      res.status(201).json({ success: true, message: "User registered successfully" });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, result) => {
    if (err) {
      console.error("Error logging in:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const user = result[0];
    try {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.status(200).json({ success: true, message: "Login successful", userId: user.id });
      } else {
        res.status(400).json({ success: false, message: "Incorrect password" });
      }
    } catch (err) {
      console.error("Error comparing password:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });
});

// Save Sleep Data
app.post("/saveSleepData", (req, res) => {
  const { userId, hours, date } = req.body;

  if (!userId || !hours || !date) {
    return res.status(400).json({ success: false, message: "User ID, hours, and date are required" });
  }

  const checkQuery = "SELECT * FROM sleep_data WHERE user_id = ? AND date = ?";
  db.query(checkQuery, [userId, date], (err, result) => {
    if (err) {
      console.error("Error checking sleep data:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ success: false, message: "You already logged sleep data for today" });
    }

    const insertQuery = "INSERT INTO sleep_data (user_id, hours, date) VALUES (?, ?, ?)";
    db.query(insertQuery, [userId, hours, date], (err) => {
      if (err) {
        console.error("Error saving sleep data:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
      res.status(201).json({ success: true, message: "Sleep data saved successfully" });
    });
  });
});

// Get Sleep Data for Last 7 Days
app.get("/getSleepData/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT hours, date
    FROM sleep_data
    WHERE user_id = ?
    ORDER BY date DESC
    LIMIT 7
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching sleep data:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        hours: 0,
      };
    });

    results.forEach((entry) => {
      const matchingDay = last7Days.find((day) => day.date === entry.date);
      if (matchingDay) matchingDay.hours = entry.hours;
    });

    res.status(200).json(last7Days.reverse());
  });
});

// Search Recipes by Ingredients
app.post("/recipes/search", (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ success: false, message: "Ingredients are required." });
  }

  const query = `
    SELECT DISTINCT r.id, r.recipe_name, r.instructions
    FROM recipes r
    JOIN recipeingredients ri ON r.id = ri.recipe_id
    JOIN ingredients i ON ri.ingredient_id = i.id
    WHERE i.ingredient_name IN (?)
  `;

  db.query(mysql.format(query, [ingredients]), (err, results) => {
    if (err) {
      console.error("Error searching recipes:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    console.log('Query Results:', results);  
    res.status(200).json(results);
  });
});



// Get Ingredients for a Specific Recipe
app.get("/recipes/:recipeId/ingredients", (req, res) => {
  const { recipeId } = req.params;

  const query = `
    SELECT i.ingredient_name
    FROM ingredients i
    JOIN recipeingredients ri ON i.id = ri.ingredient_id
    WHERE ri.recipe_id = ?
  `;

  db.query(query, [recipeId], (err, results) => {
    if (err) {
      console.error("Error fetching ingredients:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    res.status(200).json(results);
  });
});

app.get('/get-food-calories', (req, res) => {
  const foodName = req.query.food;

  if (!foodName) {
    return res.status(400).json({ error: 'Food name is required' });
  }

  // Query the database for the food item
  const query = 'SELECT calories_per_100g FROM food_items WHERE name = ? OR FIND_IN_SET(?, alternate_names)';
  db.execute(query, [foodName, foodName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Food not found in the database' });
    }

    // Return the calorie information for the food item
    const caloriesPer100g = results[0].calories_per_100g;
    res.json({ calories_per_100g: caloriesPer100g });
  });
});



// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
