# UnderSec-PhoneLoginTask

A modern, minimalist login security simulation lab designed for cybersecurity training and UI/UX exploration.

## 🚀 Overview

**UnderSec-PhoneLoginTask** is a high-fidelity "shooting range" (靶场) for simulating mobile OTP (One-Time Password) login flows. It provides a safe environment for students and security enthusiasts to practice identifying login patterns, testing UI vulnerabilities, or simply exploring modern authentication interfaces.

## ✨ Features

- **Modern Minimalist UI**: Crafted with Tailwind CSS and Framer Motion for a premium, responsive experience.
- **OTP Simulation**: Realistic "Get Code" flow with a 60-second countdown and simulated network latency.
- **Security Hint System**: A built-in debug tooltip (bottom-right) to reveal the generated OTP for testing purposes.
- **Multi-language Support**: Seamlessly toggle between English and Chinese.
- **Success State**: Smooth transitions to a post-login dashboard view.
- **Cybersecurity Focused**: Designed specifically for educational labs and security demonstrations.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jhuiwery/UnderSec-PhoneLoginTask.git
   cd UnderSec-PhoneLoginTask
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Usage

1. Enter any 10+ digit phone number.
2. Click **"Get Code"** (获取验证码).
3. Look at the **bottom-right corner** of the screen. Click the "Eye" icon to reveal the simulated OTP.
4. Enter the 4-digit code into the input field.
5. Click **"Login Now"** (立即登录) to see the success state.

## 🌐 Deployment

This project is configured for automatic deployment to **GitHub Pages** via GitHub Actions.

### Setup Instructions:

1.  Push your code to the `main` branch of your GitHub repository.
2.  Go to your repository on GitHub.
3.  Navigate to **Settings** > **Pages**.
4.  Under **Build and deployment** > **Source**, select **GitHub Actions**.
5.  The next time you push to `main`, the workflow in `.github/workflows/deploy.yml` will automatically build and deploy your site.

Your site will be available at: `https://jhuiwery.github.io/UnderSec-PhoneLoginTask/`

---
Built for **UnderSec Lab** education initiatives.
