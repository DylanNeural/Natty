const express = require("express");
const cors = require("cors");
const connectDB = require("./backend/config/db");
const authRoutes = require("./backend/routes/auth.routes");
const mealsRoutes = require("./backend/routes/meals.routes");

const app = express();

// Connect to MongoDB
connectDB();

// CORS for local dev (reflects origin, allows credentials)
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

// API routes
app.use("/api/profile", require("./backend/routes/profile.routes"));
app.use("/api/progress", require("./backend/routes/progress.routes"));
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealsRoutes);

// Health/test route
app.get("/", (req, res) => {
  res.send("API Natty en ligne");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Connecte a MongoDB (si aucun message d'erreur au-dessus)");
  console.log(`Serveur backend demarre sur http://localhost:${PORT}`);
});
