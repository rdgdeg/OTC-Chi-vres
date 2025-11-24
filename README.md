<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1wIyGJtQKxMw36lX_tBBnqePCZRQ8gc_2

## Run Locally

**Prerequisites:**  Node.js (v18+)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your `GEMINI_API_KEY` (required for AI features)
   
   Get your free API key at: https://ai.google.dev/

3. **Run the app:**
   ```bash
   npm run dev
   ```
   
   The app will be available at: http://localhost:3000

## Configuration

- **Gemini API** (Required): For AI chatbot and image generation
- **Mapbox** (Optional): Token already included, but you can override it
- **Supabase** (Optional): Database credentials already configured

## 📚 Documentation

For detailed documentation, see:
- 🚀 **[Quick Start Guide](QUICK-START.md)** - Get started in 3 minutes
- 🔧 **[Configuration Guide](CONFIGURATION.md)** - Detailed setup instructions
- ✅ **[Verification Checklist](VERIFICATION.md)** - Testing and troubleshooting
- 📋 **[Technical Overview](RESUME.md)** - Project summary and improvements
- 📚 **[Documentation Index](DOCS-INDEX.md)** - Complete documentation map

## 🗺️ Features

- **Interactive Maps** with Mapbox GL (museums, walks, restaurants)
- **AI Chatbot** powered by Google Gemini
- **AI Image Generation** for museum photos
- **Full CMS** with admin panel
- **Supabase Database** with real-time sync
- **Responsive Design** with Tailwind CSS
- **14 Pages** including heritage, walks, events, blog, shop
