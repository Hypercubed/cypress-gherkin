import { feature, scenario, given, Given, when, When, then, Then } from '@hypercubed/cypress-gherkin';

Given('a user visits {string}', (a: string) => {

});

When('they click the link labeled {string}', (a: string) => {

});

Then('the URL should include {string}', (a: string) => {

});

When('they type {string} into the {string} input', (a: string, b: string) => {

});

Then('the {string} input has {string} as its value', (a: string, b: string) => {

});

feature('My First Test', () => {
  scenario('Navigates on click', () => {
    given('a user visits "https://example.cypress.io"');
    when('they click the link labeled "type"');
    then('the URL should include "/commands/actions"');
  });
  
  scenario('Types and asserts', () => {
    given('a user visits "https://example.cypress.io/commands/actions"');
    when('they type "fake@email.com" into the ".action-email" input');
    then('the ".action-email" input has "fake@email.com" as its value');
  });
});
