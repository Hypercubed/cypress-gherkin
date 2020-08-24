import { feature, scenario, Given, given, and, When, when, Then, then } from '@hypercubed/cypress-gherkin';

Given('I am out shopping', () => {

});

Given('I have eggs', () => {

});

Given('I have milk', () => {

});

Given('I have butter', () => {

});

When('I check my list', () => {

});

Then('I don"t need anything', () => {

});

feature('My First Test', () => {
  scenario('All done', () => {
    given('I am out shopping');
      and('I have eggs');
      and('I have milk');
      and('I have butter');
    when('I check my list');
    then('I don"t need anything');
  });
});
