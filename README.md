# Patient Registration System

A responsive, real-time patient input form and staff monitoring system built with Next.js and Pusher.

## Overview

The system consists of two interfaces that synchronize in real-time:

- **Patient Form** — Patients fill in their personal information
- **Staff View** — Staff monitor patient form activity in real-time

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Styling** — TailwindCSS
- **Real-Time** — Pusher (WebSocket)
- **Validation** — Zod + React Hook Form
- **Deployment** — Vercel

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Setup environment variables

Copy `.env.example` and create a new file named `.env`

```bash
cp .env.example .env
```

> **Note** — `.env` is already added to `.gitignore` so it will not be committed to Git, keeping your secrets safe.

Open `.env` and fill in the actual values:

| Variable                 | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `PUSHER_APP_ID`          | Pusher App ID (from Pusher Dashboard → App Keys) |
| `PUSHER_KEY`             | Pusher Key                                       |
| `PUSHER_SECRET`          | Pusher Secret                                    |
| `NEXT_PUBLIC_PUSHER_KEY` | Same value as `PUSHER_KEY`                       |

> **Note** — The Pusher cluster is fixed to `ap1` (Singapore) in the codebase. No need to add it to `.env`.

### 4. Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Path       | Description                           |
| ---------- | ------------------------------------- |
| `/`        | Home — select role (Patient or Staff) |
| `/patient` | Patient form                          |
| `/staff`   | Staff real-time monitor               |

---

## Development Planning

### Project Structure

```
├── app/                              # Next.js App Router (routing only)
│   ├── page.tsx                      # Home route
│   ├── patient/page.tsx              # Patient route
│   ├── staff/page.tsx                # Staff route
│   └── api/pusher/trigger/
│       └── route.ts                  # Pusher API route
│
├── scenes/                           # UI & logic per page
│   ├── home/
│   │   └── HomePage.tsx
│   ├── patient/
│   │   └── PatientForm.tsx
│   └── staff/
│       └── StaffView.tsx
│
├── components/                       # Reusable UI components
│   ├── ui/
│   │   ├── ToastProvider.tsx
│   │   ├── InputField.tsx
│   │   ├── SelectField.tsx
│   │   └── TextAreaField.tsx
│   ├── staff/
│   │   ├── FieldRow.tsx
│   │   └── StatusBadge.tsx
│   └── home/
│       └── RoleCard.tsx
│
├── lib/                              # Shared utilities
│   └── pusher/
│       ├── client.ts                 # Pusher client instance (browser)
│       ├── server.ts                 # Pusher server instance (API)
│       └── trigger.ts               # triggerPatientEvent helper
│
└── types/                            # TypeScript types
    └── patient/
        ├── patient.schema.ts         # Zod schema + PatientFormValues
        ├── types.ts                  # FORM_STATUS, FormStatus
        └── pusher.ts                 # PATIENT_CHANNEL, FORM_UPDATE_EVENT, PusherPayload
```

**Folder responsibilities:**

- `app/` — Routing only. Each `page.tsx` contains only an import and a render call.
- `scenes/` — UI and logic for each page. All UI changes are made here.
- `lib/` — Shared utilities that can be imported by any folder equally.
- `types/patient/types.ts` — Business logic types (FormStatus).
- `types/patient/pusher.ts` — Pusher-specific constants and payload type.

### Design Decisions

**Mobile**

- Single column layout for all form fields
- Full-width submit button
- Label stacked above value in FieldRow

**Desktop (md+)**

- Two-column grid for form fields
- Label and value displayed side by side in FieldRow (`sm:flex-row`)
- Max width container (`max-w-3xl` in `PatientForm` and `max-w-2xl` in `StaffView`) centered on large screens

**Form UX**

- Fields are locked after submission using `fieldset disabled`
- Toast notification displayed on successful submission
- Validation errors shown inline below each field

### Component Architecture

| Component       | Purpose                                                                             |
| --------------- | ----------------------------------------------------------------------------------- |
| `HomePage`      | Role selection landing page (Patient or Staff)                                      |
| `PatientForm`   | Form with validation, real-time sync, and submit logic                              |
| `StaffView`     | Subscribes to Pusher and renders Patient Infomation real-time sync from PatientForm |
| `RoleCard`      | For Select route to direct `patient` or `staff`                                     |
| `StatusBadge`   | Shows Active / Inactive / Submitted status                                          |
| `FieldRow`      | Single label-value row with `whitespace-pre-wrap` support for address               |
| `InputField`    | Reusable text input with error state                                                |
| `SelectField`   | Reusable select with error state                                                    |
| `TextAreaField` | Reusable textarea with error state                                                  |
| `ToastProvider` | Provides toast context for the layout                                               |

### Real-Time Synchronization Flow

Pusher acts as the broadcast layer between Patient and Staff using WebSocket connections.

```
Patient opens the form
  → useEffect mount → POST /api/pusher/trigger { status: ACTIVE }
  → pusherServer.trigger(PATIENT_CHANNEL, FORM_UPDATE_EVENT, payload)
  → Pusher broadcasts via WebSocket
  → StaffView receives event → StatusBadge changes to Active

Patient types in any field
  → useWatch() detects change
  → POST /api/pusher/trigger { data, status: ACTIVE }
  → StaffView receives event → PatientCard updates in real-time

Patient submits the form
  → setIsLocked(true) → POST /api/pusher/trigger { data, status: SUBMITTED }
  → StaffView displays submitted banner

Patient closes tab or browser
  → beforeunload → navigator.sendBeacon → status: INACTIVE
  → StaffView StatusBadge changes to Inactive
```

---

## Bonus Features

- **Form lock after submit** — Prevents editing after successful submission using `fieldset disabled`
- **Inactive on tab close** — Uses `beforeunload` + `navigator.sendBeacon` to notify staff when the patient closes the tab
- **Toast notifications** — User feedback on successful form submission
- **Address multi-line support** — Staff view correctly renders line breaks in the address field
