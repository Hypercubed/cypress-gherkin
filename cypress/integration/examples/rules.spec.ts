import { Given, When, Then, gherkin, feature, given, when, then, but, and, rule, example } from '@hypercubed/cypress-gherkin';

Given('there are {int} {float} coins inside', (count: any, denomination: any) => {
  // TODO: implement this
  assert(count)
  assert(denomination)
});

Given('there are no chocolates inside', () => {
  // TODO: implement this
})

Given('there are {int} chocolates inside', (chocolateCount: any) => {
  // TODO: implement this
  assert(chocolateCount)
})

When(
  'the customer tries to buy a {float} chocolate with a {float} coin',
  (price: any, paid: any) => {
    // TODO: implement this
    assert(price)
    assert(paid)
  }
)

Then('the sale should not happen', () => {
  // TODO: implement this
})

Then("the customer's change should be {int} {float} coin(s)", (
  count: any,
  denomination: any
) => {
  // TODO: implement this
  assert(count)
  assert(denomination)
})

gherkin(`
Feature: Rules in Gherkin Text
  You can place scenarios inside rules. This makes is possible to structure
  Gherkin documents in the same way as [example maps](https://cucumber.io/blog/bdd/example-mapping-introduction/).
  You can also use the Examples synonym for Scenario to make them even more similar.
  
  Rule: a sale cannot happen if change cannot be returned
    # sad path
    Example: no change
      Given there are 5 0.20 coins inside
      When the customer tries to buy a 0.85 chocolate with a 1 coin
      Then the sale should not happen
  
    # happy path
    Example: exact change
      Given there are 5 0.20 coins inside
      And there are 3 chocolates inside
      When the customer tries to buy a 0.80 chocolate with a 1 coin
      Then the customer's change should be 1 0.20 coin

  Rule: a sale cannot happen if we're out of stock
    # sad path
    Example: no chocolates left
      Given there are no chocolates inside
      But there are 10 0.5 coins inside
      When the customer tries to buy a 0.85 chocolate with a 1 coin
      Then the sale should not happen
`);

feature('Rules in Gherkin Syntax', () => {
  rule('a sale cannot happen if change cannot be returned', () => {
    // sad path
    example('no change', () => {
      given('there are 5 0.20 coins inside');
      when('the customer tries to buy a 0.85 chocolate with a 1 coin');
      then('the sale should not happen');
    });

    // happy path
    example('exact change', () => {
      given('there are 5 0.20 coins inside');
        and('there are 3 chocolates inside');
      when('the customer tries to buy a 0.80 chocolate with a 1 coin');
      then('the customer\'s change should be 1 0.20 coin');
    });
  });

  describe('a sale cannot happen if we\'re out of stock', () => {
    // sad path
    example('no chocolates left', () => {
      given('there are no chocolates inside');
        but('there are 10 0.5 coins inside');
      when('the customer tries to buy a 0.85 chocolate with a 1 coin');
      then('the sale should not happen');
    });
  });
});
