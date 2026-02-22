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
  let globalLastOtp = ""; // For Scenario 1: Reuse

  // Simple cleanup to prevent memory leaks in this mock
  setInterval(() => {
    if (otpStore.size > 10000) {
      otpStore.clear();
    }
  }, 1000 * 60 * 60);

  // API Route: Send OTP
  app.post("/api/send-otp", (req, res) => {
    const { phone, scenario } = req.body;
    if (!phone || phone.length < 7) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(phone, code);
    globalLastOtp = code;
    
    console.log(`[SERVER] [Scenario: ${scenario}] OTP for ${phone}: ${code}`);
    
    // Scenario 2: Client-side Leakage
    if (scenario === 'v2_leakage') {
      return res.json({ success: true, message: "OTP sent", debug_code: code });
    }

    res.json({ success: true, message: "OTP sent" });
  });

  // API Route: Verify OTP (Login)
  app.post("/api/verify-otp", (req, res) => {
    const { phone, otp, scenario } = req.body;
    
    let storedOtp = otpStore.get(phone);

    // Scenario 1: Reuse (Any valid OTP works for any phone)
    if (scenario === 'v1_reuse') {
      storedOtp = globalLastOtp;
    }
    
    // Scenario 3: Response Manipulation
    // We return a specific structure that the client will check
    if (scenario === 'v3_manipulation') {
      if (storedOtp && storedOtp === otp) {
        return res.json({ status: "success", code: 200, data: { verified: true } });
      } else {
        // In a real attack, the user would change this 403 to 200 and verified to true
        return res.status(403).json({ status: "error", code: 403, data: { verified: false } });
      }
    }

    if (storedOtp && storedOtp === otp) {
      res.json({ success: true, message: "Login successful", token: "session_token_123" });
    } else {
      res.status(401).json({ error: "Invalid OTP" });
    }
  });

  // Scenario 5: Password Reset (Bypass)
  app.post("/api/reset-password", (req, res) => {
    const { phone, newPassword, token, scenario } = req.body;

    // In a secure flow, we'd check if the token is valid for this phone
    if (scenario === 'v5_bypass') {
      // Vulnerability: No token check or phone check
      return res.json({ success: true, message: "Password reset successful (Bypassed!)" });
    }

    if (token === "session_token_123") {
      return res.json({ success: true, message: "Password reset successful" });
    }

    res.status(403).json({ error: "Unauthorized reset attempt" });
  });

  // API Route: Get Hint (For the UI tooltip)
  app.get("/api/otp-hint", (req, res) => {
    const { phone, scenario } = req.query;
    if (scenario === 'v1_reuse') {
      return res.json({ code: globalLastOtp || null });
    }
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
