import { setChromeLocal, setFirefoxLocal, setChromeHeadless, setFirefoxHeadless } from '../Configs/setupBrowser';
import { closeBrowser, maximizeWindow, accessWebsite } from '../Configs/setupBrowser';
import conf from '../Configs/conf';
import BaseObject from '../Objects/baseObject';
import SalaryInsightObject from '../Objects/salaryInsightsObject';

let projectUrl = "https://growth.deel.training/dev/salary-insights";
let browserType = conf.browser;

let browser;

jest.setTimeout(conf.timeoutJest);

describe('Krpl Check Salary Insights', function () {

  beforeAll(() => {

    switch (browserType) {
      case 'firefox':
        browser = setFirefoxLocal();
        break;
      case 'headless':
        browser = setChromeHeadless();
        break;
      default:
        browser = setChromeLocal();
    }

    maximizeWindow(browser);
    return accessWebsite(browser, projectUrl)
      .then(() => browser.sleep(1000));
  });

  afterAll(async () => { await closeBrowser(browser) });

  it('Check Salary Insight - role and country', async () => {
    try {
      let salaryInsightsObject = new SalaryInsightObject(browser);
      await salaryInsightsObject.setRoleSearch("QA Engineer");
      await salaryInsightsObject.setCountry("Canada");
      await salaryInsightsObject.clickOnSearch();
      await salaryInsightsObject.verifyRoleAndCountry("QA Engineer", "Canada");
    } catch (error) {
      let baseObject = new BaseObject(browser);
      baseObject.takeScreenshot("salaryInsightsError_error.png");
      throw error;
    }
  });


});
