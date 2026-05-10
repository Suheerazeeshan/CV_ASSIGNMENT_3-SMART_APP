# Oral Pathology Interactive Education (Assignment 3)

Cross-platform **React + Vite** web app aligned with the Computer Vision assignment:

- **Faculty:** PDF upload → automatic MCQs, solution review, performance reports.
- **Student:** reading, prompting templates, sample quiz, AR-style camera lab, visual image lab, **3D GLB viewer**, **CV pipeline lab** (grayscale → blur → Sobel edges + metrics, optional **Gemini vision**), graded quizzes, results.
- **Everyone:** **Bookmarks**, **Notes**, in-app **User guide** (loads screenshots from `public/guide/` when you add files), offline-first chatbot + optional Gemini text chat.
- **Android:** **Capacitor** project in `android/` for building an installable app.

## Run locally

```bash
cd oral-pathology-edu
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`). **Log in** with **role**, **display name**, and **password**. The default demo password is `demo123` unless you set `VITE_LOGIN_PASSWORD` (or per-role `VITE_FACULTY_LOGIN_PASSWORD` / `VITE_STUDENT_LOGIN_PASSWORD`) in `.env`. This is a browser-only check for the prototype; a production LMS would verify against Firebase or another backend.

## Sample PDF for quiz upload (faculty)

A ready-to-upload lecture extract is at **`public/sample-odontogenic-lecture.pdf`**. In File Explorer go to your project’s `oral-pathology-edu\public\` folder and select that file on **Upload PDF**. Regenerate it anytime with `npm run sample-pdf`.

## User guide

The in-app **User guide** lists workflow steps and named topic tiles (no screenshot files required).

Optional **3D asset:** add `public/models/tooth.glb` (see `public/models/README.txt`). Otherwise a demo GLB loads from Google’s model-viewer CDN.

## Optional Gemini (text + vision)

Copy `.env.example` to `.env`, set `VITE_GEMINI_API_KEY`, restart `npm run dev`. CV lab’s **AI describe** sends the uploaded image to Gemini when the key is present.

## Web build / static hosting

```bash
npm run build
npm run preview
```

`vite.config.ts` uses `base: './'` so assets resolve correctly on mobile wrappers and static hosts.

## Android (Capacitor)

Requires **Android Studio** + JDK.

```bash
npm run cap:sync      # build web → copy into android/
npm run cap:android   # sync then open Android Studio
```

In Android Studio: build/run on a device or emulator to produce an APK/AAB.

## Data storage

Bookmarks, notes, quizzes, and attempts live in **localStorage** on the device (no backend). Use the same browser profile when demoing faculty-created quizzes and student attempts.
