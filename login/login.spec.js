const fs = require('fs');
const csv = require('csv-parser');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const chromeDriverPath = 'H:\\BSSE606\\webdriver\\chromedriver\\chromedriver.exe'; // Ensure .exe extension for Windows

fs.createReadStream('phone.csv')
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

      // Wait for the elements to be located and interactable
      const emailInput = await driver.findElement(By.id("email"));
      const passwordInput = await driver.findElement(By.id("password"));
      const signInButton = await driver.findElement(By.css(".signin-btn"));

      await emailInput.click();
      await emailInput.sendKeys("");
      await emailInput.sendKeys(data.email);
      await passwordInput.click();
      await passwordInput.sendKeys(data.password);
      await signInButton.click();

      await driver.wait(until.urlContains('https://social-mern.netlify.app/feed'), 5000);

      // Check if sign-in was successful based on URL
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl === 'https://social-mern.netlify.app/feed') {
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
