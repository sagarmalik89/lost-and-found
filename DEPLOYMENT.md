# Lost & Found Documents Platform – Deployment Guide

This guide describes how to deploy the full-stack Lost & Found Documents platform to production (Vercel, Railway, and PostgreSQL/Prisma).

---

## 🛠️ Prerequisites & Services

To run this platform in production, you will need active credentials for the following services:

1. **PostgreSQL Database** (e.g., Supabase, Neon, AWS RDS, or Railway)
2. **NextAuth Secret** (generated random token)
3. **Google Developer Console** (for Google OAuth client keys)
4. **Cloudinary** (for secure image uploads and masked document storage)
5. **Pusher Channels** (for instant real-time claim updates and chat)
6. **Upstash Redis** (for high-speed global rate limiting)
7. **Resend** (for transactional verification emails)

---

## 📋 Environment Variables Checklist

Create a `.env` file (locally) or set these in your hosting environment (Vercel):

```env
# Database Settings
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"

# Auth Settings
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="use-a-strong-random-key"

# Google Auth Provider
GOOGLE_CLIENT_ID="xxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxx"

# Cloudinary Storage
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"

# Real-Time Broadcasting (Pusher)
PUSHER_APP_ID="123456"
PUSHER_KEY="key"
PUSHER_SECRET="secret"
PUSHER_CLUSTER="mt1"
NEXT_PUBLIC_PUSHER_KEY="key"
NEXT_PUBLIC_PUSHER_CLUSTER="mt1"

# High-Speed Security Rate-Limiting (Upstash Redis)
UPSTASH_REDIS_URL="rediss://default:password@hostname:port"

# Transactional Email (Resend)
RESEND_API_KEY="re_xxx"
```

---

## 🚀 Step 1: Database Setup & Migration

Before pushing code, prepare your remote database:

1. Copy the connection string from your PostgreSQL provider.
2. Run Prisma migrations to initialize the schema:
   ```bash
   npx prisma migrate deploy
   ```
3. To generate the Prisma Client locally:
   ```bash
   npx prisma generate
   ```

---

## ⚡ Step 2: Deploying to Vercel

### 1. Link Repository
1. Import the repository into the Vercel Dashboard.
2. Select **Next.js** as the Framework Preset.

### 2. Configure Environment Variables
Copy all the variables from your `.env` checklist directly into the **Environment Variables** section under Vercel Settings.

### 3. Build & Development Settings
To ensure the Prisma Client is generated on every Vercel build, override the Vercel build command:
* **Build Command**: `npx prisma generate && next build`
* **Install Command**: `npm install`

### 4. Deploy!
Click **Deploy**. Once completed, Vercel will provide your production URL. 

> [!IMPORTANT]
> Make sure to update your `NEXTAUTH_URL` with your actual Vercel deployment URL (e.g. `https://lost-found-docs.vercel.app`) and update the **Authorized redirect URIs** in Google Console to `https://lost-found-docs.vercel.app/api/auth/callback/google`.

---

## 🔒 Security Hardening

- **Rate-limiting**: Global API endpoints are protected using Upstash Redis rate-limiting inside Next.js Middleware.
- **CSRF Protection**: All POST/PATCH/DELETE actions require valid CORS and CSRF authentication checks.
- **OCR Masking**: Cloudinary and OCR pipeline ensure document numbers are blurred before public viewing.
