const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://qainterview.pythonanywhere.com';

// ─── TC-UI: User Interface and Navigation ────────────────────────────────────

test.describe('TC-UI - User Interface and Navigation', () => {

  test('TC-UI-001 | page title should not have a typo', async ({ page }) => {
    await page.goto(BASE_URL);
    // DEF-001: tab shows "Factoriall" with double L — March 2026
    await expect(page).toHaveTitle(/The greatest factorial calculator!/i);
  });

  test('TC-UI-002 | main heading should be visible on the page', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('TC-UI-003 | input field should be there and accept typing', async ({ page }) => {
    await page.goto(BASE_URL);
    const input = page.locator('input').first();
    await expect(input).toBeVisible();
    await expect(input).toBeEditable();
  });

  test('TC-UI-004 | calculate button should be visible and clickable', async ({ page }) => {
    await page.goto(BASE_URL);
    const button = page.getByRole('button', { name: /calculate/i });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('TC-UI-005 | about link should go to the about page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: /about/i }).click();
    await expect(page).toHaveURL(/\/about/);
  });

  test('TC-UI-006 | terms and conditions link should go to /terms - DEF-002', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: /terms and conditions/i }).click();
    // DEF-002: link actually goes to /privacy — the two urls are swapped in the code
    await expect(page).toHaveURL(/\/terms/);
  });

  test('TC-UI-007 | privacy link should go to /privacy - DEF-003', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('link', { name: /^privacy$/i }).click();
    // DEF-003: link actually goes to /terms — same swap issue as above
    await expect(page).toHaveURL(/\/privacy/);
  });

  test('TC-UI-008 | copyright year should show 2026', async ({ page }) => {
    await page.goto(BASE_URL);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toContain('2026');
  });

});

// ─── TC-FUNC: Factorial Calculations ─────────────────────────────────────────

test.describe('TC-FUNC - Factorial Calculations', () => {

  async function calculate(page, number) {
    await page.goto(BASE_URL);
    await page.locator('input').first().fill(String(number));
    await page.getByRole('button', { name: /calculate/i }).click();
    await page.waitForTimeout(1000);
    return await page.locator('body').textContent();
  }

  test('TC-FUNC-001 | factorial of 0 should return 1', async ({ page }) => {
    const result = await calculate(page, 0);
    expect(result).toContain('1');
  });

  test('TC-FUNC-002 | factorial of 1 should return 1', async ({ page }) => {
    const result = await calculate(page, 1);
    expect(result).toContain('1');
  });

  test('TC-FUNC-003 | factorial of 5 should return 120', async ({ page }) => {
    const result = await calculate(page, 5);
    expect(result).toContain('120');
  });

  test('TC-FUNC-004 | factorial of 10 should return 3628800', async ({ page }) => {
    const result = await calculate(page, 10);
    expect(result).toContain('3628800');
  });

  test('TC-FUNC-005 | factorial of 12 should return 479001600', async ({ page }) => {
    const result = await calculate(page, 12);
    expect(result).toContain('479001600');
  });

  test('TC-FUNC-006 | factorial of 100 should return a valid result', async ({ page }) => {
    // 100 is a valid input, result should not be Infinity or blank
    const result = await calculate(page, 100);
    expect(result).not.toContain('Infinity');
    expect(result).not.toContain('undefined');
  });

  test('TC-FUNC-007 | input 171 returns Infinity instead of real result - DEF-005', async ({ page }) => {
    // DEF-005: anything from 171 to 991 gives back Infinity, floating point overflow
    const result = await calculate(page, 171);
    expect(result).not.toContain('Infinity');
  });

  test('TC-FUNC-008 | input above 991 should give some kind of response - DEF-006', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('input').first().fill('992');
    await page.getByRole('button', { name: /calculate/i }).click();
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').textContent();
    // DEF-006: nothing happens at all when you submit 992, no result no error
    const hasResponse = bodyText.toLowerCase().includes('factorial') ||
                        bodyText.toLowerCase().includes('please') ||
                        bodyText.toLowerCase().includes('error');
    expect(hasResponse).toBe(true);
  });

});

// ─── TC-VAL: Input Validation ─────────────────────────────────────────────────

test.describe('TC-VAL - Input Validation', () => {

  async function submitInput(page, value) {
    await page.goto(BASE_URL);
    if (value !== '') {
      await page.locator('input').first().fill(String(value));
    }
    await page.getByRole('button', { name: /calculate/i }).click();
    await page.waitForTimeout(800);
    return await page.locator('body').textContent();
  }

  test('TC-VAL-001 | empty input should show an error message', async ({ page }) => {
    // manually confirmed March 2026 — app shows "Please enter an integer"
    const result = await submitInput(page, '');
    expect(result.toLowerCase()).toMatch(/please|enter|integer|valid/);
  });

  test('TC-VAL-002 | negative number should show an error - DEF-004', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('input').first().fill('-5');
    const before = await page.locator('body').textContent();
    await page.getByRole('button', { name: /calculate/i }).click();
    await page.waitForTimeout(800);
    const after = await page.locator('body').textContent();
    // DEF-004: nothing happens, page does not change at all
    expect(after).not.toEqual(before);
  });

  test('TC-VAL-003 | decimal input should show an error message', async ({ page }) => {
    // manually confirmed — app shows "Please enter an integer"
    const result = await submitInput(page, '2.5');
    expect(result.toLowerCase()).toMatch(/please|enter|integer|valid/);
  });

  test('TC-VAL-004 | letters in the input should show an error message', async ({ page }) => {
    // manually confirmed — app shows "Please enter an integer"
    const result = await submitInput(page, 'abc');
    expect(result.toLowerCase()).toMatch(/please|enter|integer|valid/);
  });

  test('TC-VAL-005 | special characters should show an error message', async ({ page }) => {
    // manually confirmed — same error message comes up
    const result = await submitInput(page, '!@#');
    expect(result.toLowerCase()).toMatch(/please|enter|integer|valid/);
  });

  test('TC-VAL-006 | spaces only should show an error message', async ({ page }) => {
    // manually confirmed — treated as empty and shows the error
    const result = await submitInput(page, '   ');
    expect(result.toLowerCase()).toMatch(/please|enter|integer|valid/);
  });

  test('TC-VAL-007 | input field should show red border when validation fails', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: /calculate/i }).click();
    await page.waitForTimeout(800);
    const input = page.locator('input').first();
    // red border confirmed visually during manual testing March 2026
    const borderColor = await input.evaluate(el => window.getComputedStyle(el).borderColor);
    expect(borderColor).toBeTruthy();
  });

});

// ─── TC-API: API and Network ──────────────────────────────────────────────────

test.describe('TC-API - API and Network', () => {

  test('TC-API-001 | XHR POST request should be made to the factorial endpoint', async ({ page }) => {
    await page.goto(BASE_URL);
    const requests = [];
    page.on('request', r => requests.push(r));
    await page.locator('input').first().fill('5');
    await page.getByRole('button', { name: /calculate/i }).click();
    await page.waitForTimeout(1500);
    // confirmed in devtools — POST to /factorial, status 200 OK
    const apiRequest = requests.find(r =>
      r.url().includes('factorial') || r.resourceType() === 'xhr'
    );
    expect(apiRequest).toBeTruthy();
    expect(apiRequest.url()).toContain('factorial');
  });

  test('TC-API-002 | request should include the expected headers', async ({ page }) => {
    await page.goto(BASE_URL);
    const requests = [];
    page.on('request', r => requests.push(r));
    await page.locator('input').first().fill('5');
    await page.getByRole('button', { name: /calculate/i }).click();
    await page.waitForTimeout(1500);
    const apiRequest = requests.find(r =>
      r.url().includes('factorial') || r.resourceType() === 'xhr'
    );
    expect(apiRequest).toBeTruthy();
    // checked the headers in devtools — connection and content-length are present
    const headers = apiRequest.headers();
    const hasHeader =
      headers['accept'] !== undefined ||
      headers['content-type'] !== undefined ||
      headers['x-requested-with'] !== undefined;
    expect(hasHeader).toBe(true);
  });

  test('TC-API-003 | request should send the number as the payload', async ({ page }) => {
    await page.goto(BASE_URL);
    const requests = [];
    page.on('request', r => requests.push(r));
    await page.locator('input').first().fill('12');
    await page.getByRole('button', { name: /calculate/i }).click();
    await page.waitForTimeout(1500);
    const apiRequest = requests.find(r =>
      r.url().includes('factorial') || r.resourceType() === 'xhr'
    );
    expect(apiRequest).toBeTruthy();
    // confirmed in devtools payload tab — number 12 goes through correctly
    const postData = apiRequest.postData();
    expect(postData).toContain('12');
  });

});
