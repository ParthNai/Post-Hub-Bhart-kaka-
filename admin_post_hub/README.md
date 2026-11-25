# PanchayatPost Admin & Backend Portal (admin_post_hub)

This directory contains the central administration portal, Node.js API services, static media hosting, and database seed assets for the **PanchayatPost / Post-Hub** ecosystem.

---

## Architecture Overview

| Service | Port | Description |
| :--- | :--- | :--- |
| **Admin Portal** | `3000` | React Admin panel with modern UI, hero management, templates & poster controls |
| **Backend API** | `4000` | Express / MongoDB REST API handling auth, festivals, frames, templates & downloads |
| **EGram Admin** | `3001` | EGram Panchayat administration portal |
| **EGram Backend** | `5800` | EGram backend services |
| **EGram Web** | `3002` | EGram citizen web portal |
| **PosterBanao Web** | `3003` | PosterBanao web client assets |

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or later
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017`

### 2. Install Dependencies
```bash
# Install backend dependencies
cd panchayatpostbackend
npm install
cd ..
```

### 3. Restore Clean Database & Seed Admins
```bash
# Restores all collections from dump/festivalappbackend
node setup-mongodb-and-data.js

# Configures admin accounts with passwords
node setup-admin-user.js
```

### 4. Start the Development Environment
Run the unified launcher:
```bash
# Option A: Windows Batch Launcher
start-dev-environment.bat

# Option B: Run individually
node serve-admin.js
# In a separate terminal:
cd panchayatpostbackend
node index.js
```

---

## Default Super Admin Accounts

| Admin Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Bharat Chaudhary** | `egpanchayat@gmail.com` | `Admin@123` | superadmin |
| **Harsh Mewada** | `harshmewada056@gmail.com` | `Admin@123` | superadmin |
| **Super Admin** | `admin@panchayatpost.com` | `Admin@123` | superadmin |

---

## Directory Structure
- `admin/` — Production build of the React Admin Portal with custom modern theme and dashboard enhancements.
- `panchayatpostbackend/` — Express REST API with MongoDB models, controllers, and services.
- `dump/` — BSON collection dumps for restoring clean database state.
- `uploaded/` — Public static media uploads (festival banners, hero artwork, frames, and video preloader).
- `serve-admin.js` — Unified static file and API reverse proxy server.
- `setup-mongodb-and-data.js` — Automated database reset and restore script.
- `setup-admin-user.js` — Super admin user initialisation script.
