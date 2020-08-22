import { feature, scenarioOutline, scenario, Given, given, When, when, Then, then } from '@hypercubed/cypress-gherkin';

Given('there are {int} cucumbers', (a: number) => {

});

When('I eat {int} cucumbers', (a: number) => {

});

Then('I should have {int} cucumbers', (a: number) => {

});

feature('Examples Tables in Gherkin text', () => {
  scenarioOutline('eating cucumbers', () => {
    scenarioOutline('These are passing', () => {
      scenario('example', () => {
        given('there are 12 cucumbers');
        when('I eat 5 cucumbers');
        then('I should have 7 cucumbers');
      });
      
      scenario('example', () => {
        given('there are 20 cucumbers');
        when('I eat 5 cucumbers');
        then('I should have 15 cucumbers');
      });
    });
    
    scenarioOutline('These are also passing', () => {
      scenario('example', () => {
        given('there are 22 cucumbers');
        when('I eat 5 cucumbers');
        then('I should have 17 cucumbers');
      });
      
      scenario('example', () => {
        given('there are 10 cucumbers');
        when('I eat 5 cucumbers');
        then('I should have 5 cucumbers');
      });
    });
  });
});
