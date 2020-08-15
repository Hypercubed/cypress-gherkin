import { Given, When, Then, feature, scenario, background, given, when, then, gherkin } from '../../../src/index';

let counter = 0;

Given("counter has been reset", () => {
  counter = 0;
});

When("counter is incremented", () => {
  counter += 1;
});

Then("counter equals {int}", (value: any) => {
  expect(counter).to.equal(value);
});

gherkin(
  `
  Feature: Using Background in Gherkin Text
  
     Background:
      Given counter has been reset
  
     Scenario: Basic example #1
       When counter is incremented
       Then counter equals 1
      
     Scenario: Basic example #2
       When counter is incremented
       When counter is incremented
       Then counter equals 2
  `
);

// ** OR  **

feature('Using Background in Gherkin Syntax', () => {
  background(() => {
    given('counter has been reset');
  });

  scenario('Basic example #1', () => {
    when('counter is incremented');
    then('counter equals 1');
  });

  scenario('Basic example #2', () => {
    when('counter is incremented');
    when('counter is incremented');
    then('counter equals 2');
  });
});