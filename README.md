# FE Competency Payment — React

Frontend aplikasi payment management yang mencakup fitur Invoice, Wallet Top Up, dan Refund.

**Repository:**
- Frontend: https://github.com/RonaldGustavo/FE-Competency-Payment-React
- Backend: https://github.com/RonaldGustavo/BE-Competency-Payment-Express

---

## Tech Stack

| Kategori | Teknologi | Versi |
|---|---|---|
| UI Framework | React | ^19.2.5 |
| Language | TypeScript | ~6.0.2 |
| Build Tool | Vite | ^8.0.10 |
| State Management | Redux Toolkit + React Redux | ^2.11.2 / ^9.2.0 |
| State Persistence | Redux Persist | ^6.0.0 |
| CSS / UI Library | Chakra UI | ^3.35.0 |
| HTTP Client | Axios | ^1.15.2 |
| Routing | React Router DOM | ^7.14.2 |
| Alert / Dialog | SweetAlert2 | ^11.26.24 |
| Date Utility | Moment.js | ^2.30.1 |
| Testing | Vitest + Testing Library | ^4.1.5 / ^16.3.2 |

---

## Requirements

| Tool | Versi Minimum |
|---|---|
| Node.js | 18.x |
| npm | 9.x |

---

## How to Run

### 1. Clone repository

```bash
git clone https://github.com/RonaldGustavo/FE-Competency-Payment-React.git
cd FE-Competency-Payment-React
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variable

Buat file `.env` di root project:

```env
VITE_APP_BASE_URL=http://localhost:3000
```

Sesuaikan `VITE_APP_BASE_URL` dengan URL backend yang sedang berjalan.

### 4. Jalankan development server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 5. Build untuk production

```bash
npm run build
```

---

## Running Tests

```bash
# Jalankan test dalam watch mode
npm run test

# Jalankan test sekali + tampilkan coverage
npm run test:coverage
```

---

## Backend

Backend menggunakan **Node.js + Express**. Pastikan backend sudah berjalan sebelum menjalankan frontend.

Lihat setup backend di: https://github.com/RonaldGustavo/BE-Competency-Payment-Express
