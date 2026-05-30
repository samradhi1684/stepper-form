# AI_USAGE.md

## AI Tools Used

* Claude (Anthropic) – used as a development assistant for project scaffolding, code generation, and implementation guidance.

---

## Prompts Used

### Initial Prompt

> Build a complete MVP solution for a configurable multi-step form system using React, JavaScript, Material UI, React Query, Node.js, Express.js, MongoDB, and Mongoose. Implement dynamic form rendering, draft saving, progress tracking, validation, and submission workflows.

### Follow-up Prompts

* Generate Mongoose schemas for form configurations and submissions.
* Implement REST APIs for creating, updating, listing, and submitting form entries.
* Create React Query hooks for fetching and updating submission data.
* Implement dynamic rendering of text, select, and radio fields from backend configuration.
* Add unsaved changes detection and user warnings.

---

## How AI Was Used

AI was used to:

* Generate the initial project structure.
* Scaffold backend models, controllers, routes, and API handlers.
* Generate React components and React Query hooks.
* Suggest validation and persistence approaches.
* Produce initial README and project documentation drafts.

AI was treated as a development assistant rather than a source of final code. All generated functionality was reviewed and tested before submission.

---

## Changes and Verification Performed

After generating the initial solution, the following work was performed:

* Configured and verified MongoDB connectivity.
* Seeded the form configuration required by the application.
* Debugged the initial "Form configuration not found" issue during setup.
* Verified dynamic form rendering from backend-managed configuration.
* Tested draft save and resume functionality.
* Tested validation behaviour for required fields.
* Verified progress tracking across form steps.
* Verified completed submission workflows.
* Reviewed generated documentation and ensured it reflected the implemented functionality.

---

## Issues Encountered During Development

* The application initially could not create submissions because the form configuration had not yet been seeded into MongoDB.
* Environment and database configuration required manual verification before the application could run successfully.
* Generated code required testing and validation to confirm that all assignment requirements were satisfied.

---

## Verification Process

The application was manually tested for:

1. Creating new submissions.
2. Saving drafts.
3. Refreshing the page and resuming drafts.
4. Dynamic rendering of form fields from configuration data.
5. Validation of required fields.
6. Progress tracking across steps.
7. Final form submission.
8. Unsaved changes warnings.

All core assignment flows were verified locally before submission.
