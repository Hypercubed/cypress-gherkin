import { Given, When, Then, And, But, feature, scenario, given, when, then, and, but, gherkin } from '../../src/index';

let stepCounter = 0;
let step2Counter = 0;

Given('I start fresh', () => {
  stepCounter = 0;
  step2Counter = 0;
});

When('I do something', () => {
  stepCounter += 1;
});

And('Something else', () => {
  stepCounter += 2;
});

Then('I happily work', () => {
  expect(stepCounter).to.equal(3);
});

When('I don\'t do something', () => {
  step2Counter += 1;
});

And('it is sunday', () => {
  step2Counter += 2;
});

Then('I stream on twitch', () => {
  expect(step2Counter).to.equal(3);
  step2Counter += 1;
});

But('only when not tired', () => {
  expect(step2Counter).to.equal(4);
});

gherkin(
  `
  Feature: Using "And" and "But" in Gherkin Text 
    Scenario: With an "And" everything is fine
      Given I start fresh
        And I do something
      When Something else
        Then I happily work
  
    Scenario: With a "But"
      Given I start fresh
        And I don't do something
        And it is sunday
      When I stream on twitch
        But only when not tired
  `
);

// ** OR  **

feature('Using "And" and "But" in Gherkin Syntax', () => {
  scenario('With an "And" everything is fine', () => {
    given('I start fresh');
      and('I do something');
    when('Something else');
    then('I happily work');
  });

  scenario('With a "But"', () => {
    given('I start fresh');
      and('I don\'t do something');
      and('it is sunday');
    then('I stream on twitch');
      but('only when not tired');
  });
});