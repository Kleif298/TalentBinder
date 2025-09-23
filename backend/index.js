import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
dotenv.config();

const { Client } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

client
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Connection error", err.stack));

app.get("/api/data", async (req, res) => {
  res.json({ message: "Backend ist ume!" });
});

// Login-Route (sicher, ohne Klartext-Passwort)
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query(
      "SELECT id, email, password_hash, is_admin FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (user && bcrypt.compareSync(password, user.password_hash)) {
      // JWT generieren
      const token = jwt.sign(
        { id: user.id, email: user.email, is_admin: user.is_admin },
        process.env.JWT_SECRET || "mysecret",
        { expiresIn: "1h" }
      );
      res.json({
        success: true,
        user: { id: user.id, email: user.email, is_admin: user.is_admin },
        token,
      });
    } else {
      res.json({
        success: false,
        message:
          "Login ist fehlgeschlagen. Überprüfe dein Passwort oder Email.",
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  console.log("Register request body:", req.body);
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await client.query(
      "INSERT INTO users (email, password_hash, is_admin) VALUES ($1, $2, $3) RETURNING id, email, is_admin",
      [email, hashedPassword, false]
    );
    const user = result.rows[0];
    res.json({
      success: true,
      user: { id: user.id, email: user.email, is_admin: user.is_admin },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Dashboard-Route
app.get("/api/dashboard", (req, res) => {
  res.json({ message: "Willkommen im Dashboard!" });
});

app.get("/api/dashboard/admin", (req, res) => {
  res.json({ message: "Willkommen im Dashboard-Admin!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
