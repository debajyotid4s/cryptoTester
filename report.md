# CryptoAlgo Tester - Project Report

## Overview

CryptoAlgo Tester is a web-based cryptography playground for testing classical cipher algorithms. It features a modern glassmorphism frontend and a Node.js/Express backend.

## Implemented Algorithms

### 1. Hill Cipher (2×2)
- Alphabet: A–Z (mapped to 0–25)
- Modulus: m=26
- Supports encryption and decryption
- Validates key matrix invertibility (gcd(det, 26) = 1)

### 2. Caesar Cipher
- Simple substitution cipher
- Configurable shift (1-25, default: 3)
- Encrypt: (plaintext + shift) mod 26
- Decrypt: (ciphertext - shift) mod 26

### 3. Playfair Cipher
- 5×5 key matrix (I/J combined)
- Pair-based encryption
- Handles double letters with X padding
- Decrypt reverses with padding cleanup

### 4. Vigenère Cipher
- Polyalphabetic substitution
- Keyword-based key stream
- Repeating key for text length
- Full step-by-step explanation

## Backend Structure

```
server/
├── package.json
├── test/
│   └── hill.test.js          # Automated tests (vitest)
└── src/
    ├── app.js               # Express server
    ├── routes/
    │   ├── hill.js         # Hill cipher endpoints
    │   ├── caesar.js       # Caesar cipher endpoints
    │   ├── playfair.js     # Playfair cipher endpoints
    │   ├── vigenere.js    # Vigenère cipher endpoints
    │   └── health.js       # Health check endpoint
    ├── algos/
    │   ├── hill2x2.js     # Hill cipher logic
    │   ├── caesar.js      # Caesar cipher logic
    │   ├── playfair.js    # Playfair cipher logic
    │   └── vigenere.js    # Vigenère cipher logic
    └── utils/
        ├── math.js         # mod, gcd, egcd, invMod
        ├── text.js         # sanitizeAZ, charToNumAZ, numToCharAZ
        └── validate.js     # Input validation
```

## API Endpoints

### Health
- `GET /api/health` - Health check

### Hill Cipher
- `POST /api/hill/encrypt` - Encrypt plaintext
- `POST /api/hill/decrypt` - Decrypt ciphertext

### Caesar Cipher
- `POST /api/caesar/encrypt` - Encrypt with shift
- `POST /api/caesar/decrypt` - Decrypt with shift

### Playfair Cipher
- `POST /api/playfair/encrypt` - Encrypt with key
- `POST /api/playfair/decrypt` - Decrypt with key

### Vigenère Cipher
- `POST /api/vigenere/encrypt` - Encrypt with keyword
- `POST /api/vigenere/decrypt` - Decrypt with keyword

## Request/Response Format

### Request
```json
{
  "text": "HELLO",
  "params": {
    "matrix": [[3,3],[2,5]],
    "padChar": "X",
    "shift": 3,
    "key": "CIPHER"
  }
}
```

### Response
```json
{
  "result": "RIJVS",
  "explain": {
    "summary": ["Sanitized input: \"HELLO\"", "Key: \"KEY\""],
    "facts": {"m": 26, "key": "KEY", "keyStream": "KEYKE"},
    "rows": [...],
    "notes": []
  }
}
```

## Frontend Features

### UI Components
- Algorithm selector dropdown (Hill, Caesar, Playfair, Vigenère)
- Dynamic input fields based on selected algorithm
- Sample input buttons
- Encrypt/Decrypt buttons with validation
- Output textarea with copy functionality
- Key Factors panel with step-by-step explanation
- Swap button (output → input)
- Keyboard shortcut (Ctrl+Shift+S)

### Input Fields by Algorithm
| Algorithm | Fields |
|-----------|--------|
| Hill | Key Matrix (2×2), Padding Character |
| Caesar | Shift |
| Playfair | Key |
| Vigenère | Key |

## Styling (Glassmorphism Dark Theme)

### Color Palette
- Background: Deep navy gradient (#0f0f1a, #1a1a2e)
- Primary accent: Purple (#8b5cf6)
- Secondary accent: Cyan (#22d3ee)
- Highlight: Pink (#ec4899)
- Glass effect: rgba(255, 255, 255, 0.04) with blur

### Design Features
- Animated gradient background (subtle motion)
- Glassmorphism cards with blur and transparency
- Neon accents on interactive elements
- Hover transformations on cards and buttons
- Responsive grid layout (3-column → 1-column on mobile)
- JetBrains Mono for code/inputs
- Inter for UI text

## Running the Application

```bash
cd server
npm run dev
# Server runs on http://localhost:8080
```

## Test Vectors

### Hill Cipher
| Plaintext | Key Matrix | Ciphertext |
|-----------|------------|------------|
| HELLO | [[3,3],[2,5]] | varies |

### Caesar Cipher
| Plaintext | Shift | Ciphertext |
|-----------|-------|------------|
| HELLO | 3 | KHOOR |
| KHOOR | 3 | HELLO |

### Playfair Cipher
| Plaintext | Key | Ciphertext |
|-----------|-----|------------|
| HELLO | CIPHER | ECSPGS |

### Vigenère Cipher
| Plaintext | Key | Ciphertext |
|-----------|-----|------------|
| HELLO | KEY | RIJVS |
| RIJVS | KEY | HELLO |

## Automated Tests

```bash
cd server
npm test           # Run all tests
npm run test:watch # Watch mode
```

## Project Status

- [x] Hill Cipher (2×2) - complete
- [x] Caesar Cipher - complete
- [x] Playfair Cipher - complete
- [x] Vigenère Cipher - complete
- [x] Glassmorphism UI - complete
- [x] Responsive layout - complete
- [x] API endpoints - complete
- [x] Key Factors panel - complete
- [x] Swap functionality - complete
- [x] Automated tests - complete