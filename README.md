# Stepper Form — Full Stack MVP

A configurable multi-step form system with draft saving, progress tracking, and dynamic form rendering.

---

## Folder Structure

```
stepper-form/
├── AI_USAGE.md
├── README.md
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js            # Entry point
│       ├── app.js              # Express app setup
│       ├── config/
│       │   └── db.js           # MongoDB connection
│       ├── models/
│       │   ├── FormConfig.js   # Form configuration schema
│       │   └── Submission.js   # Submission schema
│       ├── controllers/
│       │   ├── formConfigController.js
│       │   └── submissionController.js
│       ├── routes/
│       │   ├── formConfig.js
│       │   └── submissions.js
│       ├── middleware/
│       │   ├── validation.js   # Step/config validation utilities
│       │   └── errorHandler.js
│       └── seed/
│           └── formConfig.js   # Seeds the wellness-intake config
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.jsx             # Router + providers
        ├── theme.js            # MUI theme
        ├── api/
        │   └── submissions.js  # Axios API layer
        ├── hooks/
        │   └── useSubmissions.js  # React Query hooks
        ├── utils/
        │   └── validation.js   # Frontend field validation
        ├── pages/
        │   ├── SubmissionsListPage.jsx
        │   └── StepperFormPage.jsx
        └── components/
            ├── common/
            │   └── UnsavedChangesDialog.jsx
            ├── form/
            │   ├── FormField.jsx   # Dynamic field renderer (text/select/radio)
            │   └── StepForm.jsx    # Renders one step's fields
            └── submissions/
                ├── SubmissionCard.jsx
                └── CreateSubmissionDialog.jsx
```

---

## Prerequisites

- Node.js 18+
- MongoDB running locally (or provide a MongoDB Atlas URI)

---

## Setup Instructions

### 1. Clone / extract the project

```bash
cd stepper-form
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env if needed (default: mongodb://localhost:27017/stepper-form)

npm install

# Seed the form configuration into MongoDB
npm run seed

# Start the backend (development with hot reload)
npm run dev

# Or start in production mode
npm start
```

The API will be available at `http://localhost:5000`.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`. The `"proxy": "http://localhost:5000"` in `package.json` proxies all `/api` calls to the backend.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/form-config` | Returns the active form configuration |
| GET | `/api/submissions` | Lists all submissions |
| POST | `/api/submissions` | Creates a new draft submission |
| GET | `/api/submissions/:id` | Gets a single submission |
| PUT | `/api/submissions/:id` | Saves draft progress (step + answers) |
| POST | `/api/submissions/:id/submit` | Finalises and validates the submission |

---

## Key Design Decisions

### Configurable Forms
The form config lives exclusively in MongoDB. The frontend never hardcodes field names, types, or steps — it reads `GET /api/form-config` and renders dynamically. Adding a new step or field only requires updating the database record.

### Progress Calculation
Progress is not just `currentStep + 1`. It counts how many steps have ALL required fields satisfied in the saved answers. This handles step-jumping correctly.

### Draft Persistence
Answers are saved on every "Save" or "Save and Next" action via `PUT /api/submissions/:id`. On page reload the submission is fetched from the server and local state is re-hydrated, so progress is never lost.

### Validation Strategy
- **Frontend**: validates before allowing "Save and Next" or "Submit". Shows per-field error messages inline.
- **Backend**: independently validates on every save and enforces complete validation on submit. The frontend cannot bypass this.

### Unsaved Changes (Bonus)
- An "Unsaved changes" chip appears when local answers differ from the last save.
- Navigating to another step shows a dialog: stay (and save) or leave (discard).
- Closing the form or using the browser back/refresh triggers the same guard via `useBeforeUnload`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, JavaScript |
| UI | Material UI v5 |
| Server state | React Query v5 |
| HTTP client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Routing | React Router v6 |
