const { test, expect, chromium } = require('@playwright/test');

const mock_articles = [
  {
    title: 'New Book on Aphex Twin to Be Published This Autumn',
    timestamp: 1731958515
  },
  {
    title: 'An Unserious Take on Axiomatic Knowledge in the Era of Foundation Models',
    timestamp: 1731958504
  },
  {
    title: "Sam Altman will co-chair SF mayor-elect Daniel Lurie's transition team",
    timestamp: 1731958483
  },
  { title: 'Gleam 1.6.0 Is Released', timestamp: 1731958458 },
  {
    title: 'Show HN: Moon finder, little page that helps you find the moon',
    timestamp: 1731958387
  }
];

test('should return message when there are fewer than 100 articles', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // intercept network request and inject mock articles
  await page.route('**/newest', (route, request) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mock_articles)
    });
  });

  await page.goto('https://news.ycombinator.com/newest');
  const articles = mock_articles;
  let validationMessage = '';

  if (articles.length < 100) {
    validationMessage = 'Hacker news has less than 100 articles.';
  } else {
    validationMessage = 'Hacker news does not have less than 100 articles.';
  }

  expect(validationMessage).toHaveText('Hacker news has less than 100 articles.');
})

test.beforeEach(async ({ page }) => {
  await page.goto('https://news.ycombinator.com/newest');
});

test('should be in reverse chronological order', async  ({ page }) => {
  // Extract timestamps from the title attribute of .age elements
  const currentPageTimestamps = await page.locator('.age').evaluateAll((elements) =>
    elements.map((el) => parseInt(el.getAttribute('title'), 10)));

  // Verify timestamps are in reverse chronological order
  const isReverseChronological = currentPageTimestamps.every((time, i, arr) => i === 0 || time <= arr[i - 1]);
  expect(isReverseChronological).toBe(true);
});