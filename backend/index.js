import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
dotenv.config();

const { Client } = pkg;
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
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

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query(
      "SELECT id, email, password_hash, role, COALESCE(username, email) AS username FROM users WHERE email = $1;",
      [email]
    );
    const user = result.rows[0];
    const isAdmin = ["berufsbildner"].includes(user.role);
    if (user && bcrypt.compareSync(password, user.password_hash)) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, isAdmin: isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        /*development settings*/
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
        maxAge: 3600000,
        /* production settings
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 3600000,
        */
      });

      res.json({
        success: true,
        token: token,
        user: { id: user.id, email: user.email, role: user.role },
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
  const { email, password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await client.query(
      "INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, COALESCE(username, email) AS username;",
      [email, hashedPassword, username]
    );
    const user = result.rows[0];
    res.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});



app.get("/api/dashboard/callCandidates", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT * FROM candidates;"
    );
    res.status(200).json({
      success: true,
      candidates: result.rows, 
    });
  } catch (error) {
    console.error("Call Candidate Error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


app.post("/api/dashboard/registerCandidates", async (req, res) => {
  const { firstName, lastName, email, status, interests, jobBrancheInterests } = req.body || {};
  console.log("Register Candidate request body:", req.body);


  if (!firstName || !email) {
    return res.status(400).json({ success: false, message: "firstName and email are required" });
  }

  const jobInterest = Array.isArray(interests) ? interests.join(", ") : null;

  try {
    const result = await client.query(
      `INSERT INTO candidates (first_name, last_name, email, status, job_interest, job_branche_interests)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email;`,
      [firstName, lastName, email, status || "default", jobInterest, jobBrancheInterests || null]
    );
    console.log("Candidate registered with ID:", result.rows[0].id);
    res.status(200).json({ success: true, candidate: result.rows[0] });
  } catch (error) {
    console.error("Register Candidate Error: ", error);
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});


app.get("/api/dashboard/callEvents", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM events;");
    res.status(200).json({
      success: true,
      events: result.rows,
    });
  } catch (error) {
    console.error("Call Events Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/dashboard/registerEvents", async (req, res) => {
  const { title, description, startingAt, duration, invitationsSendingAt, registrationsClosingAt } = req.body || {};
  console.log("Register Event request body:", req.body);

  if (!title || !description || !startingAt) {
    return res.status(400).json({ success: false, message: "title, description, and startingAt are required" });
  }

  let formattedDuration = null;
  if (duration) {
    if (typeof duration === "string" && duration.includes(":")) {
      const parts = duration.split(":");
      if (parts.length === 2) {
        formattedDuration = `${parts[0]}:${parts[1]}:00`;
      } else if (parts.length === 3) {
        formattedDuration = duration;
      }
    }
  }

  try {
    const result = await client.query(
      `INSERT INTO events (title, description, starting_at, duration, invitations_sending_at, registrations_closing_at)
       VALUES ($1, $2, $3, $4::interval, $5, $6)
       RETURNING id, title;`,
      [title, description, startingAt, formattedDuration, invitationsSendingAt || null, registrationsClosingAt || null]
    );
    console.log("Event registered with ID:", result.rows[0].id);
    res.status(200).json({ success: true, event: result.rows[0] });
  } catch (error) {
    console.error("Register Event Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/api/dashboard/deleteEvent/:eventId", async (req, res) => {
  const { eventId } = req.params;
  console.log("Delete Event request for ID:", eventId);

  try {
    const result = await client.query("DELETE FROM events WHERE id = $1 RETURNING id;", [eventId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/dashboard/editEvent/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { title, description, startingAt, duration, invitationsSendingAt, registrationsClosingAt } = req.body || {};
  console.log("Edit Event request for ID:", eventId, req.body);

  let formattedDuration = null;
  if (duration) {
    if (typeof duration === "string" && duration.includes(":")) {
      const parts = duration.split(":");
      if (parts.length === 2) {
        formattedDuration = `${parts[0]}:${parts[1]}:00`;
      } else if (parts.length === 3) {
        formattedDuration = duration;
      }
    }
  }

  try {
    const result = await client.query(
      `UPDATE events 
       SET title = $1, description = $2, starting_at = $3, duration = $4::interval, invitations_sending_at = $5, registrations_closing_at = $6
       WHERE id = $7
       RETURNING id, title;`,
      [title, description, startingAt, formattedDuration, invitationsSendingAt || null, registrationsClosingAt || null, eventId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, event: result.rows[0] });
  } catch (error) {
    console.error("Edit Event Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/dashboard", (req, res) => {
  res.json({ message: "Willkommen im Dashboard!" });
});

app.get("/api/dashboard/admin", (req, res) => {
  res.json({ message: "Willkommen im Admin-Dashboard!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
