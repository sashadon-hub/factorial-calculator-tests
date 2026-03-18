# Factorial Calculator — QA Automation Suite

Playwright automation tests for the [Factorial Calculator](http://qainterview.pythonanywhere.com) application, submitted as part of the BitCube QA Engineer technical assessment.

---

## Project Structure

```
factorial-calculator-tests/
├── tests/
│   ├── factorial.spec.js        # Part 3 — Main test suite (UI, Functional, Validation)
│   └── part4/
│       └── additional.spec.js   # Part 4 — Additional tests (Styling, Factorial 12, API)
├── playwright.config.js
├── package.json
└── README.md
```

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

---

## Setup

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/factorial-calculator-tests.git
cd factorial-calculator-tests
```

**2. Install dependencies**

```bash
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install chromium
```

---

## Running Tests

### Run all tests (Part 3 + Part 4)

```bash
npm test
```

### Run Part 3 only (main test suite)

```bash
npm run test:main
```

### Run Part 4 only (additional tests)

```bash
npm run test:part4
```

### Run in headed mode (visible browser)

```bash
npm run test:headed
```

### View HTML report after a run

```bash
npm run report
```

---

## Test Coverage

### Part 3 — Main Suite (`tests/factorial.spec.js`)

| Suite | Test Cases |
|---|---|
| TC-UI — UI & Navigation | 8 tests |
| TC-FUNC — Factorial Calculations | 6 tests |
| TC-VAL — Input Validation | 5 tests |

### Part 4 — Additional Tests (`tests/part4/additional.spec.js`)

| ID | Description |
|---|---|
| P4-01 | Form validation styling applied on invalid submission |
| P4-02 | Factorial of 12 returns 479001600 |
| P4-03 | API call is made with correct headers and parameters |

---

## Known Bugs (Documented Defects)

The following tests are expected to **fail** due to intentional bugs in the application. This is by design — the tests document the defects rather than masking them.

| Test | Defect ID | Description |
|---|---|---|
| TC-UI-001 | DEF-001 | Page title has typo ("Factoriall") |
| TC-UI-006 | DEF-002 | Terms & Conditions link routes to /privacy |
| TC-UI-007 | DEF-003 | Privacy link routes to /terms |
| TC-UI-008 | DEF-004 | Copyright year range incomplete |
| TC-FUNC-006 | DEF-009 | Input of 1000 returns "Infinity" |
| TC-VAL-001 | DEF-007 | Empty input produces no validation error |
| TC-VAL-002 | DEF-005 | Negative integer not rejected |
| TC-VAL-003 | DEF-006 | Decimal input not rejected |
| TC-VAL-004 | DEF-008 | Alphabetical input not rejected |
| TC-VAL-005 | DEF-008 | Special character input not rejected |
| P4-01 | DEF-007 | No error styling applied on invalid input |

---

## Technology

- **Framework:** [Playwright](https://playwright.dev/) v1.44+
- **Language:** JavaScript (CommonJS)
- **Browser:** Chromium (headless by default)
- **Application Under Test:** http://qainterview.pythonanywhere.com

---

## Author

**Sasha Jinkila** — QA Automation Engineer  
Submitted for BitCube QA Technical Assessment
