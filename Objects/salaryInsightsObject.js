import { By } from 'selenium-webdriver';
import BaseObject from './baseObject';


const inputRoleSearch = By.css('input[placeholder="Select a role"]');
const inputCountrySearch = By.css('input[placeholder="Select a country"]');
const btnSearch = By.xpath('//button[contains(text(),"Search")]');
const btnListSelected = By.css('div[role="presentation"]');
const titleChart = By.xpath('//div[contains(@data-qa,"salary-table")]/h2');

export default class SalaryInsightObject extends BaseObject {
  constructor(browser) {
    super(browser);
  }


  async setRoleSearch(role) {
    await this.setWhenVisible(inputRoleSearch, role);
    await this.waitForElementToBeLoaded(btnListSelected);
    await this.clickOnElement(btnListSelected);
  }

  async setCountry(country) {
    await this.setWhenVisible(inputCountrySearch, country);
    await this.waitForElementToBeLoaded(btnListSelected);
    await this.clickOnElement(btnListSelected);

  }


  async clickOnSearch() {
    await this.waitForElementToBeLoaded(btnSearch);
    await this.clickOnElement(btnSearch);
  }

  async verifyRoleAndCountry(role, country) {
    await this.waitForElementToBeLoaded(titleChart);
    expect(await this.getElementText(titleChart)).toContain(role + " compensation in " + country);
  }

}
