import { feature, scenario, Given, given, and, When, when, Then, then, but } from '@hypercubed/cypress-gherkin';

Given('a user visits {string}', (a: string) => {

});

Given('something', () => {

});

When('they click the link labeled {string}', (a: string) => {

});

Then('the URL should include {string}', (a: string) => {

});

Then('something else', () => {

});

feature('My First Test', () => {
  scenario('Navigates on click', () => {
    given('a user visits "https://example.cypress.io"');
    and('something');
    when('they click the link labeled "type"');
    then('the URL should include "/commands/actions"');
    but('something else');
  });
});
