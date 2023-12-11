
const fs = require('fs');
const csv = require('csv-parser');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const chromeDriverPath = 'H:\\BSSE606\\webdriver\\chromedriver\\chromedriver.exe'; // Ensure .exe extension for Windows

fs.createReadStream('regdata.csv')
  .pipe(csv())
  .on('data', async (data) => {
    // Initialize WebDriver for each data entry
    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options())
      .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
      .build();

    try {
      await driver.get("https://social-mern.netlify.app/");
      await driver.manage().window().setRect({ width: 1050, height: 964 });
      await driver.findElement(By.linkText("sign up")).click()
      await driver.findElement(By.id("name")).click()
      await driver.findElement(By.id("name")).sendKeys(data.name)
      await driver.findElement(By.id("email")).click()
      await driver.findElement(By.id("email")).sendKeys(data.email)
      await driver.findElement(By.id("password")).click()
      await driver.findElement(By.id("password")).sendKeys(data.password)
      await driver.findElement(By.id("remember")).click()
      await driver.findElement(By.css(".signin-btn")).click()

    await driver.wait(until.urlContains('https://social-mern.netlify.app/'), 5000);

      // Check if sign-in was successful based on URL
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl === 'https://social-mern.netlify.app/') {
        console.log("Test passed for:", data.email);
      } else {
        console.log("Test failed for:", data.email);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      console.log("Test failed for:", data.email);
    } finally {
      await driver.quit();
    }
  })
  .on('end', () => {
    console.log('Test data iteration complete');
  });