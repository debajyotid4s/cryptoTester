# CryptoAlgo Tester — Development Workflow (Simple Frontend + Node.js Backend)

This workflow is optimized for:
- **Simple frontend** (plain HTML/CSS/JS)
- **Node.js backend** (Express JSON API)
- Showing **key factors** (static tables/panels; no heavy visualization/animation)
- **Incremental delivery**: start with 1 algorithm (Hill 2×2), then add more

> MVP algorithm: **Hill Cipher (2×2), alphabet A–Z, modulus m=26**.

---

## 0) Prerequisites

- Node.js 18+ recommended
- npm 9+ (or pnpm/yarn)
- Any IDE

Check:
```bash
node -v
npm -v
```

---

## 1) Repository / Project layout (recommended)

```text
cryptoalgo-tester/
  server/
    package.json
    src/
      app.js
      routes/
        hill.js
        health.js
      algos/
        hill2x2.js
      utils/
        validate.js
        text.js
        math.js
  client/
    index.html
    style.css
    app.js
  workflow.md
```

**Why this structure works**
- `algos/` contains pure implementations (easy to test, reusable)
- `routes/` contains HTTP layer only (validation + formatting)
- `utils/` shares helpers across algorithms (sanitize, mod math, etc.)
- `client/` is static and can be served by Express → no CORS, easy local demo

---

## 2) Initialize backend (Express)

From project root:

```bash
mkdir -p server/src/{routes,algos,utils} client
cd server
npm init -y
npm i express
npm i -D nodemon
```

Add scripts to `server/package.json`:
```json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js"
  }
}
```

---

## 3) Define the shared API style (so adding algorithms is easy)

### 3.1 API philosophy
For every algorithm, return:
- `result` (final output)
- `explain` (key factors: intermediate artifacts and checks)

### 3.2 Endpoint convention (recommended)
Start with Hill, but design for many algorithms:

- `POST /api/:algo/encrypt`
- `POST /api/:algo/decrypt`

For MVP:
- `POST /api/hill/encrypt`
- `POST /api/hill/decrypt`

### 3.3 Common request/response pattern
Request body shape varies slightly per algorithm, but keep it consistent:

**Request**
```json
{
  "text": "HELLO",
  "params": {
    "matrix": [[3,3],[2,5]],
    "padChar": "X"
  }
}
```

**Response (success)**
```json
{
  "result": "....",
  "explain": {
    "summary": ["..."],
    "facts": { "m": 26 },
    "tables": [],
    "rows": [],
    "notes": []
  }
}
```

**Response (error)**
```json
{
  "error": "Human readable message",
  "details": { }
}
```

> Tip: even if only Hill uses `params.matrix` now, this structure scales cleanly when you add Caesar (`params.shift`), Vigenère (`params.key`), etc.

---

## 4) Backend development workflow (MVP-first)

### Step A — Implement reusable utilities (used by many ciphers)

Create:
- `server/src/utils/math.js`
  - `mod(n, m)` (always returns 0..m-1)
  - `gcd(a,b)`
  - `egcd(a,b)` (extended Euclid)
  - `invMod(a, m)` (throws if not invertible)

- `server/src/utils/text.js`
  - `sanitizeAZ(text)` → uppercase and keep only A–Z
  - `charToNumAZ('A'..'Z') => 0..25`
  - `numToCharAZ(0..25) => 'A'..'Z'`

Create:
- `server/src/utils/validate.js`
  - `requireString(x, fieldName)`
  - `require2x2Matrix(x, fieldName)`
  - `requirePadCharAZ(x)` (default to `X`)

These utilities are fast to write and reduce bugs later.

---

### Step B — Implement Hill Cipher 2×2 logic as pure functions

Create:
- `server/src/algos/hill2x2.js`

Implement in this order:

1. Matrix helpers:
   - `det2x2(A)`
   - `invMat2x2Mod(A, m)` (here m=26)
     - compute det
     - compute `detInv = invMod(det mod m, m)`
     - inverse = `detInv * [[d,-b],[-c,a]] mod m`
     - if gcd(det,m)!=1 → error with details

2. Block helpers:
   - Convert sanitized text into 2-char blocks
   - Pad with `padChar` to make length divisible by 2

3. Encrypt/decrypt:
   - `encrypt(text, matrix, { padChar, m })`
   - `decrypt(text, matrix, { m })`

Return `{ result, explain }` where `explain` contains:
- sanitized input
- pad added count
- blocks (`["HE","LL","OX"]`)
- numeric blocks (`[[7,4],[11,11],[14,23]]`)
- key matrix
- `det`, `detMod26`, `gcd(det,26)`, `detInvMod26` (if exists)
- inverse matrix (for decrypt; optional but good for encrypt too)
- per-block multiplication results (rows for a table)

---

### Step C — Create routes for Hill cipher

Create:
- `server/src/routes/hill.js`

Endpoints:
- `POST /api/hill/encrypt`
- `POST /api/hill/decrypt`

Responsibilities:
- validate request body
- normalize params (`padChar` default `X`)
- call algorithm
- send JSON success/error
- use HTTP status `400` for invalid inputs/non-invertible key

---

### Step D — Create a health endpoint (debug convenience)

Create:
- `server/src/routes/health.js`

Endpoint:
- `GET /api/health` → `{ "ok": true }`

Useful to confirm the server is up.

---

### Step E — Create Express app + serve frontend statics

Create:
- `server/src/app.js`

Responsibilities:
- `express.json()`
- mount routes:
  - `/api/health`
  - `/api/hill/*`
- serve `client/` statics via Express:
  - `app.use(express.static(pathToClient))`
- listen on port `3000` (or env `PORT`)

Serving statics from the same server keeps the workflow simple (no CORS).

---

## 5) Frontend workflow (simple and scalable)

### 5.1 UI requirements (MVP)
Create in `client/index.html`:
- Algorithm selector (can be fixed to Hill for MVP, but add dropdown early if easy)
- Input textarea
- 2×2 matrix inputs (4 number fields)
- Encrypt + Decrypt buttons
- Output textarea
- Copy button
- **Key Factors** panel (static):
  - determinant + invertibility
  - inverse matrix
  - block table

### 5.2 Frontend logic (client/app.js)
- Gather form data into:
  - `text`
  - `params` (matrix, padChar)
- Call:
  - `fetch('/api/hill/encrypt', ...)` or `/decrypt`
- Render:
  - `result` into output textarea
  - `explain` into:
    - bullet summary
    - small facts table
    - blocks table

### 5.3 Styling (client/style.css)
Keep minimal:
- two-column layout
- tables readable
- `<details>` section for Key Factors (collapsed by default)

---

## 6) Run commands (local dev)

### Start dev server (auto-reload)
```bash
cd server
npm run dev
```

Open:
- http://localhost:3000

### Production start
```bash
cd server
npm start
```

---

## 7) Correctness checklist (Hill 2×2 MVP)

### Text handling
- [ ] sanitize to uppercase A–Z
- [ ] ignore spaces/punctuation consistently (document this in UI)
- [ ] pad with `X` if odd length

### Key validity
- [ ] matrix must be 2×2 integers
- [ ] compute det
- [ ] require `gcd(det, 26) == 1` for invertibility
- [ ] show a clear error if invalid (include det and gcd in details)

### Roundtrip test
- [ ] decrypt(encrypt(plaintext)) equals sanitized plaintext (plus padding if added)

Use a known invertible key like:
```text
[[3,3],
 [2,5]]
```

---

## 8) Key Factors (explain panel) — what to show (no heavy viz)

Recommended sections:
1. Sanitized input + padding count
2. Key matrix
3. Determinant facts:
   - det
   - det mod 26
   - gcd(det, 26)
   - det inverse mod 26 (if exists)
4. Inverse matrix mod 26 (especially for decrypt)
5. Block processing table:
   - input block + nums
   - operation `A * v (mod 26)`
   - output nums + output block

This gives an “LCS DP table” style of transparency without animation.

---

## 9) Adding the next algorithm (post-MVP pattern)

When Hill works:
1. Add `server/src/algos/<algo>.js` exporting:
   - `encrypt(text, params)`
   - `decrypt(text, params)`
2. Add `server/src/routes/<algo>.js`
3. Add frontend form controls for that algo under the same UI shell
4. Keep response shape consistent (`{ result, explain }`)

Good easy additions:
- Caesar (shift + mapping row + per-char table)
- Vigenère (key alignment + per-char table)

---

## 10) Common pitfalls (avoid)

- Negative modulo bugs → always use `mod()`
- Mixing A=1 vs A=0 mapping → use A=0..Z=25 everywhere
- Not validating invertibility → decryption impossible for non-invertible matrices
*
