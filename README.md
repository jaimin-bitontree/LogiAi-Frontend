# Logi AI — Frontend

A modern, AI-powered logistics management platform built with React 19, TypeScript, and Tailwind CSS.

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Auth | JWT Decode |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page-level components
├── service/        # API service functions
├── App.tsx         # Root component
├── main.tsx        # Entry point
└── index.css       # Global styles (Tailwind)
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/logi-ai-frontend.git

# Navigate to the project
cd logi-ai-frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Running Locally

```bash
npm run dev
```

App will be available at `http://localhost:5173`


## 📦 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |

---

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | ✅ Yes |

> ⚠️ Never commit `.env` to version control. It is already listed in `.gitignore`.
