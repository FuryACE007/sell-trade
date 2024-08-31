// sell-trade.e2e-spec.ts
import { browser, element, by } from 'protractor';

describe('Sell Trade E2E Test', () => {
  beforeEach(() => {
    browser.get('/sell-trade');
  });

  it('should execute a sell trade successfully', async () => {
    const instrumentSelect = element(by.css('select[formControlName="instrumentId"]'));
    const quantityInput = element(by.css('input[formControlName="quantity"]'));
    const targetPriceInput = element(by.css('input[formControlName="targetPrice"]'));
    const submitButton = element(by.css('button[type="submit"]'));

    await instrumentSelect.click();
    await element(by.cssContainingText('option', 'AAPL')).click();
    await quantityInput.sendKeys('50');
    await targetPriceInput.sendKeys('150');
    await submitButton.click();

    const successMessage = element(by.css('.success-message'));
    expect(await successMessage.isPresent()).toBeTruthy();
    expect(await successMessage.getText()).toContain('Trade executed successfully');
  });

  it('should show an error when trying to sell more than owned', async () => {
    const instrumentSelect = element(by.css('select[formControlName="instrumentId"]'));
    const quantityInput = element(by.css('input[formControlName="quantity"]'));
    const targetPriceInput = element(by.css('input[formControlName="targetPrice"]'));
    const submitButton = element(by.css('button[type="submit"]'));

    await instrumentSelect.click();
    await element(by.cssContainingText('option', 'AAPL')).click();
    await quantityInput.sendKeys('1000');  // Assuming this is more than owned
    await targetPriceInput.sendKeys('150');
    await submitButton.click();

    const errorMessage = element(by.css('.error-message'));
    expect(await errorMessage.isPresent()).toBeTruthy();
    expect(await errorMessage.getText()).toContain('Insufficient quantity to sell');
  });
});
