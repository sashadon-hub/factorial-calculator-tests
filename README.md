# Factorial Calculator — QA Automation

Playwright automation suite built for the BitCube technical assessment (March 2026).

## Setup

```bash
npm install
npx playwright install chromium
npx playwright test
```

To run specific suites:

```bash
npm run test:main      # Part 3 only
npm run test:part4     # Part 4 only
npm run test:headed    # visible browser
npm run report         # open HTML report
```

## My Approach

I started with manual exploratory testing before writing any automation. That is how i caught the swapped footer links a smoke test would have missed those completely. The automation was then built to match my test case document so everything is traceable back to a documented test case.

I left tests that hit real bugs as FAILING on purpose. Automation should reflect the truth of the system, not just show green to make everyone feel good.

## Known Bugs (7 Total)

These match my PDF defect report. The tests below will fail intentionally.

| ID | Issue | Severity |
|---|---|---|
| DEF-001 | Typo in page title, "Factoriall" | Low |
| DEF-002 | Terms and Conditions link goes to /privacy | Medium |
| DEF-003 | Privacy link goes to /terms | Medium |
| DEF-004 | Negative numbers produce no response | High |
| DEF-005 | Inputs 171 to 991 return Infinity | High |
| DEF-006 | Inputs above 991 freeze the app | High |
| DEF-007 | Legal pages show placeholder text | Low |

## Engineering Notes

**P4-01 Styling:** During manual testing i could see a red border appearing on the input field when invalid data is submitted. The problem is the app doesnt apply an explicit CSS class or aria-invalid attribute, its just browser-native validation styling. So the automated test cant detect it through computed styles. I kept it as a fail to flag it as an accessibility gap rather than pretend its fine.

**Large Numbers:** Anything above 170 overflows to Infinity. In a real production app id use BigInt or return a proper value out of range message so the user actually knows whats happening.

**Negative Numbers:** Entering a negative number and clicking Calculate does nothing at all, no result, no error. The app should reject it with a clear message since factorial isnt defined for negative numbers.

## Project Structure

```
factorial-calculator-tests/
├── tests/
│   ├── factorial.spec.js        # Part 3, main suite
│   └── part4/
│       └── additional.spec.js   # Part 4, additional scenarios
├── playwright.config.js
├── package.json
└── README.md
```

## Tech Stack

Framework: Playwright v1.44 (JavaScript)  
Runtime: Node.js v18  
Browser: Chromium headless  
Reports: HTML, List, JSON  

**Sasha Jinkila** — QA Automation Engineer  
BitCube Technical Assessment, March 2026
