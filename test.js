const puppeteer = require("puppeteer");

const getInfo = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    // await page.goto('https://www.zoho.com/crm/n/');
    // await page.click('.zgh-login');
    // await page.waitForNavigation();
    await page.goto(
      "https://accounts.zoho.com/signin?servicename=NewCRM&https://zcrm.zoho.com/index.do?TODO=addUser"
    );
    await page.type("#login_id", "redacted", { delay: 100 });
    await page.click("#nextbtn");
    await page.type("#password", "redacted", { delay: 100 });
    await page.click("#nextbtn");
    await page.waitForNavigation();
    await page.click(".remindlaterdomains");
    await page.waitForNavigation();
    await page.goto("https://crm.zoho.com/crm/org699381531/tab/Potentials");
    await page.goto(
      "https://crm.zoho.com/crm/org699381531/tab/Potentials/4266643000037779027"
    );
    const oppName = await page.evaluate(() => {
      page.waitForSelector("#subvalue_POTENTIALNAME");
      return document.querySelector("#subvalue_POTENTIALNAME").innerHTML;
    });
    console.log(oppName);
    // await page.goto('LINK');
    await browser.close();
  } catch (error) {
    console.log(error.message);
  }
};
getInfo();
