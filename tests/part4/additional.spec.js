const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://qainterview.pythonanywhere.com';

// part 4 - three additional test scenarios documented separately

test('P4-01 | input field should show error styling when validation fails', async ({ page }) => {
  await page.goto(BASE_URL);
  const input = page.locator('input').first();

  // click calculate without entering anything to trigger validation
  await page.getByRole('button', { name: /calculate/i }).click();
  await page.waitForTimeout(800);

  const borderColor = await input.evaluate(el =>
    window.getComputedStyle(el).borderColor
  );
  const ariaInvalid = await input.getAttribute('aria-invalid');
  const classList = await input.evaluate(el => el.className);

  // red border is visible manually but the browser handles it as a default style
  // so the automated check cant pick it up through css or aria attributes
  const hasErrorStyling =
    borderColor.includes('255, 0, 0')   ||
    borderColor.includes('220, 38, 38') ||
    ariaInvalid === 'true'              ||
    classList.includes('error')         ||
    classList.includes('invalid');

  expect(hasErrorStyling).toBe(true);
});

test('P4-02 | factorial of 12 should return 479001600', async ({ page }) => {
  await page.goto(BASE_URL);

  await page.locator('input').first().fill('12');
  await page.getByRole('button', { name: /calculate/i }).click();
  await page.waitForTimeout(1000);

  // tested this manually and confirmed the result is correct
  const bodyText = await page.locator('body').textContent();
  expect(bodyText).toContain('479001600');
});

test('P4-03 | api call should go to the right endpoint with the correct data', async ({ page }) => {
  await page.goto(BASE_URL);

  const requests = [];
  page.on('request', request => { requests.push(request); });

  await page.locator('input').first().fill('5');
  await page.getByRole('button', { name: /calculate/i }).click();
  await page.waitForTimeout(1500);

  // looking for the xhr request that gets made when you click calculate
  const apiRequest = requests.find(r =>
    r.url().includes('factorial') || r.resourceType() === 'xhr'
  );

  // confirmed in devtools - POST to /factorial, status 200, number sent as payload
  expect(apiRequest).toBeTruthy();
  expect(apiRequest.url()).toContain('factorial');

  const headers = apiRequest.headers();
  const hasExpectedHeader =
    headers['accept'] !== undefined ||
    headers['content-type'] !== undefined ||
    headers['x-requested-with'] !== undefined;
  expect(hasExpectedHeader).toBe(true);

  const postData = apiRequest.postData();
  expect(postData).toContain('5');
});
