# Code Explanation: `src/app/about/page.tsx`

## Overview

This file is a **Next.js page component** (`AboutPage`) that renders the **"About the Society"** page for the BSU Debate Society website. It serves as the organization's identity and principles page, drawing directly from the Society's Constitution (Articles 1–5).

---

## Key Data Structure

```typescript
const principles = [ ... ]; // Array of 15 objects
```

A `principles` array holds 15 objects, each with a `title` and `description`. These represent the **15 Core Principles** of the Debate Society, as defined in **Article 3 of the Constitution**. Each object is later mapped into card components.

---

## JSX Structure (Top to Bottom)

```tsx
<div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
```

### Outer Container
- **`mx-auto`** – Centers the container horizontally.
- **`min-h-[calc(100vh-4rem)]`** – Sets minimum height to the full viewport height minus 4rem (64px, likely the navbar height). This makes the page fill the screen below the header.
- **`max-w-6xl`** – Caps the width at a large breakpoint (72rem / 1152px).
- **`flex flex-col justify-center`** – Vertically centers content using flexbox.
- **Responsive padding** – `px-6` on mobile, `sm:px-10` on small screens, `lg:px-16` on large screens.

### Inner Card Section
```tsx
<section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
```

A **large card container** with:
- `rounded-3xl` – Extra-large rounded corners.
- `border border-neutral-800` – Dark gray border.
- `bg-neutral-950/95` – Near-black background with 95% opacity.
- `shadow-xl shadow-black/30` – Large shadow with 30% black.
- `backdrop-blur-sm` – Subtle backdrop blur effect (glassmorphism aesthetic).

---

## Sections Breakdown

The page contains **6 main sections** inside the card:

### 1. "Back to Home" Navigation
```tsx
<a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white">
```
- A left-aligned link back to the homepage.
- Includes an **SVG arrow icon** (pointing left) using Heroicons-style `<path>`.
- Hover effect: text color transitions from `neutral-400` (gray) to `white`.

### 2. Header
```tsx
<p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
  Articles 1–3 — Identity & Principles
</p>
<h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] ...">
  About the Society
</h1>
```
- Subtitle indicates the constitutional source (Articles 1–3).
- The `h1` title has a **gradient background** (`yellow → gold → amber`) with `rounded-full` pill shape, giving it a highlighted badge appearance.

### 3. Introduction
```tsx
<article className="mx-auto max-w-3xl space-y-4 text-center">
```
- A centered paragraph explaining the Constitution's role as the supreme governing document.

### 4. Organization Identity (Articles 1 & 2)
- Describes the Society's name, vision, and mission.
- Emphasizes inclusivity, critical thinking, and intellectual curiosity.

### 5. Membership (Article 5)
```tsx
<article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-8 ...">
```
- An **article card** explaining membership is open to all BSU students regardless of background.
- Wrapped in the same card styling as the main section (nested card).

### 6. Declaration of Principles (Article 3) — The 15 Principles Grid

```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {principles.map((principle) => (
    <article key={principle.title} className="rounded-3xl border ...">
      <h3 className="text-lg font-semibold text-white">{principle.title}</h3>
      <p className="mt-3 text-sm leading-6 text-neutral-300">
        {principle.description}
      </p>
    </article>
  ))}
</div>
```
- **Responsive grid**: 1 column on mobile, 2 on `sm`, 3 on `lg`.
- Each principle is rendered as a mini card with title + description.
- Uses `key={principle.title}` for React list rendering (assumes titles are unique).

### 7. Rights of Members (Article 4)
- Another article card describing member rights:
  - Freedom of speech & assembly
  - Right to file candidacy & suffrage
  - Access to records
  - Due process & protection from exploitation
  - Right to form/join organizations

---

## Visual Design System

The page follows a consistent **dark theme** with:
- **`neutral-950`** background (near-black)
- **`neutral-800`** borders
- **`neutral-300` / `neutral-400`** body text
- **`white`** headings
- **`neutral-500`** italic subtitles
- **Yellow/gold accent** (`#ffde00` → `#efa706`) for the main title badge
- **Glassmorphism** via `backdrop-blur-sm` and semi-transparent backgrounds

---

## Focus on the Requested Snippet

```tsx
<div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
  <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
    <div className="space-y-10">
      {/* Go Back Navigation */}
      <div>
```

### Line-by-line:

| Line | Purpose |
|---|---|
| `mx-auto` | Centers the outer container horizontally |
| `flex min-h-[calc(100vh-4rem)]` | Full-height flex container (100vh minus 4rem navbar) |
| `max-w-6xl` | Caps width at 72rem (~1152px) for readability |
| `flex-col justify-center` | Stacks children vertically and centers them |
| `px-6 py-16` | Horizontal padding 1.5rem, vertical padding 4rem |
| `sm:px-10 lg:px-16` | More horizontal padding on larger screens |
| `rounded-3xl` | Outer card has very rounded corners (1.5rem radius) |
| `border border-neutral-800` | 1px solid dark border |
| `bg-neutral-950/95` | 95% opacity black background |
| `p-10` | Card inner padding of 2.5rem |
| `shadow-xl shadow-black/30` | Large black shadow at 30% opacity |
| `backdrop-blur-sm` | Frosted glass blur effect behind the card |
| `space-y-10` | Adds 2.5rem vertical gap between children of this div |

This creates the **main layout structure**: a full-height page wrapper with a centered, glassmorphic card containing all the content sections, starting with the "Back to Home" navigation link.