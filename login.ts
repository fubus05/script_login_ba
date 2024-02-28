const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
import UserAgent from 'user-agents';
puppeteer.use(StealthPlugin());

const url = 'http://18.170.2.4:3000/token';
const headers = {
  'Content-Type': 'application/json',
  'authorization': 'dde0155ce6fb488eb1d49fe775bbf7eb',
};

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true, 
    slowMo: 100,
    args: ['--proxy-server=brd.superproxy.io:22225']
  });
  const page = await browser.newPage();

  try {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' });
    const randomUserAgent = userAgent.toString();
  
    await page.setUserAgent(randomUserAgent);

    await page.goto('https://www.britishairways.com/travel/execenrol/execclub/_gf/en_ua?source=MNVEXC1join_the_executive_club&campaignCode=MMBNAV#logintr');
    await page.authenticate({
      username: 'brd-customer-hl_2fc6814c-zone-ba_token_generation',
      password: 'n5wr1tx02ygo'
     });

    await page.waitForSelector('#ensAcceptAll');
    await page.click('#ensAcceptAll');
    
    await page.waitForSelector('#membershipNumber');
    await page.type('#membershipNumber', 'prygor.i.y@gmail.com'); // prygor.i.y@gmail.com test_reg_aurth@outlook.com
    await page.type('#input_password', 'g0hcPp5lR27G'); 

    await page.waitForSelector('.loginButton button#ecuserlogbutton');
    await page.click('.loginButton button#ecuserlogbutton');

    await page.goto('https://www.britishairways.com/travel/viewaccount/execclub/_gf/en_ua?eId=106012&prim=execcl', { waitUntil: 'load' });

    const cookies = await page.cookies();
    const tokenCookie = cookies.find(cookie => cookie.name === 'token');
    const extractedText = await page.$eval('#membershipNumberValue', element => element.textContent);

    const requestData = {
      token: tokenCookie.value,
      mid: extractedText,
      server: 3,
    };

    fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    })
    .then(response => console.log(response.status))
    .catch(error => console.error('Error:', error));    
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
})();

export {};