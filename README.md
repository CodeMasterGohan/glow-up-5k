<div align="center">
  <img width="1200" height="475" alt="Glow Up 5K Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  # 🏃‍♂️ Glow Up 5K
  ### From Base Building to PR: A 5-Week Elite Training Program

  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
</div>

---

## 🌟 Overview

**Glow Up 5K** is a performance-focused training application designed to guide runners through a scientifically structured 5-week block. Whether you're looking to establish a routine or crush your current 5K record, this app provides the structure, tracking, and motivation needed to peak on race day.

## 🚀 Key Features

- **📊 Comprehensive 5-Week Periodization**
  - **Week 1: Base Building** – Establishing your aerobic foundation.
  - **Week 2: Volume & Duration** – Building strength and endurance.
  - **Week 3: Peak Training** – The hardest training block for maximum stimulus.
  - **Week 4: Sharpening** – Maintaining intensity while reducing volume.
  - **Week 5: Taper & Race** – Shedding fatigue to hit your PR.
- **🏃‍♂️ Specialized Workouts**
  - Aerobic Easy Runs & Long Runs.
  - VO2 Max Intervals (400m, 800m, 1-mile repeats).
  - Lactate Threshold Tempo runs.
  - Active Recovery & Strength Cross-Training.
- **📈 Integrated Tracking**
  - **Plan View**: Your daily companion for workout details.
  - **Stats View**: Monitor your volume and intensity metrics.
  - **Races View**: Manage your competition calendar.

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript
- **Tooling**: Vite
- **Infrastructure**: Docker, Nginx (Alpine)

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (Optional, for containerized deployment)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone git@github.com:CodeMasterGohan/glow-up-5k.git
   cd glow-up-5k
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Set your `GEMINI_API_KEY` in `.env.local` if using AI-assisted features.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Running with Docker

Build and run the production image using Docker Compose:

```bash
docker compose up --build -d
```

Access the app at `http://localhost:3000` (or your configured port).

## 🏁 The 5K Program Philosophy

The workouts in this plan follow a linear periodization model:
- **RPE (Rate of Perceived Exertion)** is used to guide intensity (Scale 1-10).
- **Speed Work** targets specific physiological adaptations like running economy and lactate clearance.
- **Tapering** ensures you arrive at the start line with "fresh legs" but high muscle tension.

---

<div align="center">
  Built with ❤️ for the Running Community. 
</div>
