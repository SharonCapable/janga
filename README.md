# Janga — Autonomous Video Factory

Janga is a self-hosted AI pipeline that automatically generates and publishes short-form faceless videos (30–60 seconds) to TikTok, Instagram Reels, and YouTube Shorts.

## How It Works

1. User creates a **Series** (niche, tone, target platform)
2. User creates an **Episode** with a topic (or uses Magic Suggest)
3. Clicks **Start Generation**
4. The pipeline automatically:
   - Starts the GPU inference server on GCP
   - Generates a script using Gemini 2.5 Flash-Lite
   - Generates narration using Google Cloud TTS
   - Generates video clips using CogVideoX-2B
   - Stitches everything together with FFmpeg
   - Uploads the final video to Google Cloud Storage
   - Shuts down the GPU server when done
5. User reviews and approves the video
6. Video is posted to connected social accounts

## Architecture

```
User Browser
    │
    ▼
Next.js App (Vercel)
    │
    ├── /api/jobs          → Creates generation job in database
    ├── /api/start-pipeline → Starts GCP VMs via Compute API
    ├── /api/worker        → Job queue API for the Python worker
    └── /api/jobs/timeout  → Cron: marks stuck jobs as failed
         │
         ▼
GCP: videogen-orchestrator (e2-standard-2, always-on)
    │   Python worker (Flask webhook server on port 8082)
    │   ├── Receives webhook from Next.js
    │   ├── Generates script (Gemini 2.5 Flash-Lite)
    │   ├── Generates narration (Google Cloud TTS)
    │   └── Calls GPU server for video clips
    │
    ▼
GCP: cogvideox-prod (g2-standard-8, NVIDIA L4 GPU)
    │   FastAPI server on port 8080
    └── CogVideoX-2B model inference
         │
         ▼
Google Cloud Storage (videogen-out-1771487929)
    ├── audio/    → TTS narration files
    ├── clips/    → Raw CogVideoX clips
    └── final/    → Stitched output videos
```

## Tech Stack

**Frontend**
- Next.js (App Router)
- Tailwind CSS
- Supabase Auth
- Prisma ORM + PostgreSQL

**Backend / ML**
- Python 3.10
- CogVideoX-2B (video generation)
- Google Cloud TTS (narration)
- Gemini 2.5 Flash-Lite(script generation)
- FFmpeg (video stitching)
- Flask (webhook server)

**Infrastructure**
- GCP Compute Engine (2 VMs)
- Google Cloud Storage
- Vercel (Next.js hosting)
- Supabase (database + auth)

## GCP Infrastructure

| VM | Machine Type | GPU | Purpose |
|----|-------------|-----|---------|
| `videogen-orchestrator` | e2-standard-2 | None | Worker, TTS, orchestration |
| `cogvideox-prod` | g2-standard-8 | NVIDIA L4 24GB | CogVideoX inference |

The GPU VM auto-starts when a generation is triggered and auto-shuts down after 10 minutes of idle time.

## Environment Variables

### Next.js (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=

# GCP
GCP_PROJECT_ID=
GCP_ZONE=
GCP_STORAGE_BUCKET=
GCP_CLIENT_EMAIL=
GCP_SA_PRIVATE_KEY=       # base64-encoded service account private key
GPU_VM_NAME=
ORCHESTRATOR_VM_NAME=

# AI
GEMINI_API_KEY=
GPU_SERVER_URL=
TTS_SERVER_URL=

# Worker
DB_API_URL=
WORKER_API_KEY=
WORKER_WEBHOOK_URL=

# Cron
CRON_SECRET=

# Social
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
```

### Worker VM (.env)

```env
DB_API_URL=
WORKER_API_KEY=
GPU_SERVER_URL=
GEMINI_API_KEY=
GCP_STORAGE_BUCKET=
GCP_PROJECT_ID=
GCP_ZONE=
GPU_VM_NAME=
```

## Local Development

```bash
# Install dependencies
cd janga
npm install

# Set up database
npx prisma migrate dev

# Run development server
npm run dev
```

## Worker Setup (videogen-orchestrator VM)

```bash
cd ~/videogen
source venv/bin/activate
pip install -r requirements.txt

# Run as webhook server (recommended)
python main.py --serve

# Or run as pure polling worker
python main.py
```

## Systemd Services

Both VMs use systemd to auto-start services on boot.

**cogvideox-prod:** `sudo systemctl status cogvideo`
**videogen-orchestrator:** `sudo systemctl status worker`

## Job Status Flow

```
pending → booting → processing → complete
                 ↘ failed (if VMs unreachable or pipeline errors)
```

Jobs stuck in `pending`, `booting`, or `processing` for over 90 minutes are automatically marked as `failed` by the timeout cron.

GPU VM only runs during active generation (~25-50 min per video).

## Roadmap

- [x] Video generation pipeline
- [x] Web app with series/episode management
- [x] Auto VM start/stop
- [x] Job queue with status tracking
- [ ] Social media auto-posting (TikTok, YouTube)
- [ ] Scheduled video generation
- [ ] Video review and approval flow
- [ ] Multi-user support