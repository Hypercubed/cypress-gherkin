import { feature, rule, example, given, Given, when, When, then, Then, and, but } from '@hypercubed/cypress-gherkin';

Given('there are {int} {float} coins inside', (a: number, b: number) => {

});

When('the customer tries to buy a {float} chocolate with a {int} coin', (a: number, b: number) => {

});

Then('the sale should not happen', () => {

});

Given('there are {int} chocolates inside', (a: number) => {

});

Then('the customer"s change should be {int} {float} coin', (a: number, b: number) => {

});

Given('there are no chocolates inside', () => {

});

feature('Rules', () => {
  rule('a sale cannot happen if change cannot be returned', () => {
    example('no change', () => {
      given('there are 5 0.20 coins inside');
      when('the customer tries to buy a 0.85 chocolate with a 1 coin');
      then('the sale should not happen');
    });
    
    example('exact change', () => {
      given('there are 5 0.20 coins inside');
      and('there are 3 chocolates inside');
      when('the customer tries to buy a 0.80 chocolate with a 1 coin');
      then('the customer"s change should be 1 0.20 coin');
    });
  });
  
  rule('a sale cannot happen if we"re out of stock', () => {
    example('no chocolates left', () => {
      given('there are no chocolates inside');
      but('there are 10 0.5 coins inside');
      when('the customer tries to buy a 0.85 chocolate with a 1 coin');
      then('the sale should not happen');
    });
  });
});
