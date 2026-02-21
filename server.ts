import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database for OTPs
  const otpStore = new Map<string, string>();

  // API Route: Send OTP
  app.post("/api/send-otp", (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(phone, code);
    
    console.log(`[SERVER] OTP for ${phone}: ${code}`);
    
    // Simulate delay
    setTimeout(() => {
      res.json({ success: true, message: "OTP sent" });
    }, 1000);
  });

  // API Route: Verify OTP (Login)
  app.post("/api/verify-otp", (req, res) => {
    const { phone, otp } = req.body;
    
    const storedOtp = otpStore.get(phone);
    
    // Simulate delay
    setTimeout(() => {
      if (storedOtp && storedOtp === otp) {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ error: "Invalid OTP" });
      }
    }, 1000);
  });

  // API Route: Get Hint (For the UI tooltip)
  app.get("/api/otp-hint", (req, res) => {
    const { phone } = req.query;
    if (typeof phone === "string") {
      const code = otpStore.get(phone);
      return res.json({ code: code || null });
    }
    res.json({ code: null });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
