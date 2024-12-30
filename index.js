const express = require("express");
const app = express();
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  puppeteer = require("puppeteer-core");
  chrome = require("chrome-aws-lambda");
} else {
  puppeteer = require("puppeteer");
}

app.get("/api", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);
    let page = await browser.newPage();
    await page.goto("https://www.google.com");
    res.send(await page.title());
    await browser.close();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error occurred");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
