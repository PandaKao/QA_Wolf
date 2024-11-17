// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const articles = [];

  while (articles.length < 100) {
    // get articles on current page with timestamps converted to Date
    const currentPageTitles = await page.locator('.titleline > a').allTextContents();
    const currentPageTimestamps = await page.locator('.age').evaluateAll((elements) => 
      elements.map((el) => 
//double check with meg if I need to split the string and convert to Date
        (el.getAttribute('title'))));
      

    // create and add to existing array of objects
    const currentPageArticles = currentPageTitles.map((title, index) => ({
      title, timestamp: currentPageTimestamps[index],
    }));
    articles.push(...currentPageArticles);

    if (articles.length < 100) {
      // clicks more to load the next 30 articles
      await page.locator('.morelink').click();
      // wait for new page to load
      await page.locator('.titleline > a').first().waitFor({ state: 'attached' });
    }
  }

  // grab only first 100 articles
  const hundredArticles = articles.slice(0, 100);

  // time validation
  const validationErrors = [];

  // checks if the current timestamp is later than the previous timestamp
//ask about needing to make tests for a failed validation
  for (let i = 1; i < hundredArticles.length; i++) {
    if (hundredArticles[i].timestamp > hundredArticles[i - 1].timestamp) {
      validationErrors.push(`Issue at index ${i}`)
    }
  };

  if (validationErrors.length > 0) {
    console.log(`Validation failed: Articles are not sorted from newest to oldest with ${validationErrors.length} error(s).`);
    validationErrors.forEach((error) => {
      console.log(error);
    })
  } else {
    console.log('Validation passed: Articles are sorted from newest to oldest');
  }
}

(async () => {
  await sortHackerNewsArticles();
})();