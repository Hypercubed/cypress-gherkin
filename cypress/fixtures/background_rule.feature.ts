import { feature, background, given, Given, rule, scenario } from '@hypercubed/cypress-gherkin';

Given('the background', () => {

});

Given('a user visits {string}', (a: string) => {

});

feature('My First Test', () => {
  background(() => {
    given('the background');
  });
  
  rule('A rule', () => {
    scenario('Navigates on click', () => {
      given('a user visits "https://example.cypress.io"');
    });
    
    scenario('Types and asserts', () => {
      given('a user visits "https://example.cypress.io/commands/actions"');
    });
  });
});
