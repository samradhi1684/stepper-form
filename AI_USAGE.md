# AI_USAGE.md

## AI Tools Used

- **Claude (Anthropic)** — used as a code generation assistant throughout the project.

---

## Prompts Given

1. **Initial architecture prompt:**
   > "Build a complete MVP solution for a configurable Stepper Form system. Frontend: React, JavaScript, Material UI, React Query. Backend: Node.js, Express.js, MongoDB, Mongoose. Implement all API endpoints, Mongoose models, React pages, React Query hooks, and validation. Include the bonus unsaved changes detection."

2. **Follow-up refinements (iterative):**
   - "Ensure `answers` is stored as a `Map` in Mongoose and correctly serialized to/from plain objects in controllers."
   - "Add proper index annotations to Mongoose schemas for the expected query patterns (listing by status + date, lookup by formConfigId)."
   - "The `useBeforeUnload` hook should gate on `hasUnsaved` state, not always fire."
   - "The `UnsavedChangesDialog` needs to handle two cases: step navigation within the form, and navigating away from the page entirely — unify with a `pendingNavigateAway` ref."

---

## What Was Modified from AI Output

| Area | Modification |
|------|-------------|
| **Mongoose `answers` field** | AI initially used `Object` type which loses type safety. Changed to `Map<String, Mixed>` and added explicit `Object.fromEntries()` calls in the controller to safely convert before use. |
| **Progress calculation** | AI output calculated progress as `currentStep + 1` (positional). Changed to count steps where ALL required fields pass validation — more accurate and survives step-jumping. |
| **`UnsavedChangesDialog` dual-mode** | AI generated a single-purpose dialog. Extended it with a `pendingNavigateAway` ref to cover both in-form step changes and page-level navigation without duplicating the component. |
| **FormConfig validation** | AI didn't include a `validateFormConfig()` utility. Added it to guard every endpoint that consumes config, as specified in the edge cases requirement. |
| **`useBeforeUnload` dependency** | AI included `hasUnsaved` in the callback but not the dependency array of `useCallback`, causing a stale closure. Fixed the dependency array. |
| **Stepper click-to-navigate** | AI didn't implement clicking step labels to jump between steps. Added `handleStepClick` with unsaved-changes gating. |
| **Error serialization** | AI returned `err.message` directly from controllers. Changed to structured `{ error: string }` JSON responses for consistent frontend parsing. |

---

## What AI Got Wrong

1. **Stale closure in `useBeforeUnload`** — AI omitted `hasUnsaved` from the `useCallback` dep array, meaning the browser warning would never actually fire after the first render.
2. **Answers serialization** — AI stored answers as a plain JS `Object` in Mongoose, which works but loses the semantic of `Map`. More importantly, it didn't add `Object.fromEntries()` when reading back from the model, causing silent `[object Object]` errors in deep merges.
3. **`isLoading` vs `isPending`** — AI used `isLoading` for mutations (React Query v5 removed this in favour of `isPending`). Corrected throughout.
4. **Submit validation scope** — AI only validated the current step on submit. The spec requires ALL steps to be valid before submitting. Rewrote `handleSubmit` to iterate all steps and jump to the first failing one.

---

## How Correctness Was Verified

1. **Manual walkthrough** of every user flow described in the product requirements:
   - Create submission → fill step → save → refresh page → confirm progress persisted.
   - Try to submit with empty required fields → confirm error messages appear and submit is blocked.
   - Navigate away with unsaved changes → confirm dialog appears.
   - Complete all steps → submit → confirm status changes to `completed`.

2. **Schema cross-check** — compared the Mongoose schema field names against the API contract and the frontend field renderers to ensure no naming mismatches.

3. **Edge case review** — manually traced code paths for:
   - Invalid/nonexistent `id` in URL (CastError caught in controllers).
   - Out-of-range `currentStep` in PUT body (validated against `config.steps.length`).
   - Missing form config in DB (404 returned cleanly).
   - Broken config (validated with `validateFormConfig()` before rendering or saving).

4. **React Query cache coherence** — verified that `onSuccess` callbacks in mutation hooks correctly update both the individual submission cache entry and invalidate the list query.
