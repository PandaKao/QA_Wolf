const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');
});



test('News articles should be in reverse chronological order', async  ({ page }) => {
  // Extract timestamps from the `title` attribute of `.age` elements
  const currentPageTimestamps = await page.locator('.age').evaluateAll((elements) =>
    elements.map((el) => parseInt(el.getAttribute('title'), 10)));

  // Verify timestamps are in reverse chronological order
  const isChronological = currentPageTimestamps.every((time, i, arr) => i === 0 || time <= arr[i - 1]);

  expect(isChronological).toBe(true);
});