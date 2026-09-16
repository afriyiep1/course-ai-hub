# Course AI Hub

A working prototype for **DS 6021: Introduction to Predictive Modeling** with two connected experiences:

- **Student Learning Coach** — course-grounded explanations, hints, debugging support, quizzes, understanding checks, and TA escalation.
- **TA Copilot** — escalation review, editable responses, misconception insights, rubric-aligned feedback drafting, and approved FAQ management.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current prototype

The prototype includes a curated DS 6021 knowledge engine and stores pilot interactions in the browser. It does not yet process official student records.

## Planned integrations

- Canvas LTI 1.3 authentication and role-based launch
- Canvas course-material synchronization
- Approved language-model endpoint
- Shared institutional data storage
- Course-specific retrieval and evaluation pipeline

## Routes

- `/student` — Student Learning Coach
- `/ta` — TA Copilot

Built for the University of Virginia School of Data Science pilot.
