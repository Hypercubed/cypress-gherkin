import { feature, background, Given, given, scenario, When, when, Then, then } from '@hypercubed/cypress-gherkin';

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
  // This is a comment on the feature
  // Could be multiple lines

  background(() => {
    // Can also have comments

    given('a user visits "https://example.cypress.io"');
  });

  scenario.only('Navigates on click @regression @important @sanity', () => {
    when('they click the link labeled "type"');
    then('the URL should include "/commands/actions"');
  });
  
  scenario('Types and asserts @optional', () => {
    // Comments here too
    
    given('a user visits "https://example.cypress.io/commands/actions"');
    when('they type "fake@email.com" into the ".action-email" input');
    then('the ".action-email" input has "fake@email.com" as its value');
  });
});
