# Piki Team

A modern web platform for a boxing gym to organize training videos and centralize gym information.

---

## Problem

Training and sparring videos were being shared through WhatsApp, which made them easy to lose, hard to organize, and difficult to revisit over time.

---

## Solution

Piki Team provides a structured video library where content is automatically grouped by week and training type, allowing fighters and coaches to easily access past sessions and track progress.

---

##  Live Demo

https://pikiteam.vercel.app/

---

## Screenshots

### Home Page

![Home](./screenshots/home1.png)

### Contact Section

![Home](./screenshots/home2.png)

### Video Filters

![Videos](./screenshots/home-videos.png)

### Video Library

![Videos](./screenshots/home-videos2.png)

---

## Features

*  Gym landing page with schedule and contact information
*  Public video library organized automatically by calendar week
*  Filtering by training type (sparring / training)
*  Professor login with delete permissions
*  YouTube-backed playback for published videos
*  Fast and responsive UI powered by Vite
*  Clean and modern design with Tailwind CSS

---

##  Tech Stack

* React 19
* TypeScript
* Vite
* Tailwind CSS 4

---

##  Project Structure

* `src/pages/` → main pages (`HomePage`, `VideosPage`)
* `src/components/` → reusable UI components
* `src/sections/` → home page sections
* `src/data/siteContent.ts` → centralized editable content
* `public/` → static assets and images

---

##  Installation

Clone the repository and run it locally:

```bash
git clone https://github.com/your-username/piki-team.git
cd piki-team
npm install
npm run dev
```

---

##  Video Organization Logic

Videos are automatically grouped by calendar week based on their `publishedAt` field.

* No manual configuration is required
* Adding a new video automatically updates the UI
* Weeks are calculated starting on Monday

---

##  Adding New Videos

La carga de videos desde la app esta habilitada.

* Hay selector de archivos
* Hay drag and drop
* La pagina prepara una cola de subida antes de publicar
* El profesor puede subir o borrar material existente

---

##  Future Improvements

* Comments and likes system
* Improved mobile experience

---

##  What I Learned

* Structuring a scalable React + TypeScript project
* Designing UI driven by structured data
* Solving a real-world problem with a simple architecture
* Building a clean and maintainable component system

---

##  Notes

This project was built as a real solution for a boxing gym to improve how training content is stored and accessed.
