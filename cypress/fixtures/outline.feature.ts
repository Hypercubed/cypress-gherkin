import { feature, scenarioOutline, outline, given, when, then, examples, Given, When, Then } from '@hypercubed/cypress-gherkin';

Given('there are {int} cucumbers', (a: number) => {

});

When('I eat {int} cucumbers', (a: number) => {

});

Then('I should have {int} cucumbers', (a: number) => {

});

feature('Examples Tables in Gherkin text', () => {
  // Sometimes it can be desireable to run the same scenario multiple times
  // with different data each time. This can be done by placing an Examples
  // section with an Examples Table underneath a Scenario, and use <placeholders>
  // in the Scenario, matching the table headers.

  scenarioOutline('eating cucumbers', () => {
    outline(() => {
      given('there are <start> cucumbers');
      when('I eat <eat> cucumbers');
      then('I should have <left> cucumbers');
    });
    
    examples('These are passing', [
      ['start', 'eat', 'left'],
      [12, 5, 7],
      [20, 5, 15]
    ]);
    
    examples('These are also passing', [
      ['start', 'eat', 'left'],
      [22, 5, 17],
      [10, 5, 5]
    ]);
  });
});
