import { Given, When, Then, feature, scenario, given, when, then, gherkin } from '@hypercubed/cypress-gherkin';

Given('a user visits {string}', (s: string) => {
  return cy.visit(s);
});

When('they click the link labeled {string}', (s: string) => {
  return cy.get('a').contains(s).click();
});

When('they type {string} into the {string} input', (e: string, s: string) => {
  return cy.get(s).type(e);
});

Then('the URL should include {string}', (s: string) => {
  return cy.url().should('include', s);
});

Then('the {string} input has {string} as its value', (e: string, s: string) => {
  return cy.get(e).should('have.value', s);
});

gherkin(
  `
    @hello
    Feature: My First Test (Gherkin text)
      Scenario: Navigates on click
        Given a user visits "https://example.cypress.io"
        When they click the link labeled "type"
        Then the URL should include '/commands/actions'

      Scenario: Types and asserts
        Given a user visits "https://example.cypress.io/commands/actions"
        When they type "fake@email.com" into the ".action-email" input
        Then the '.action-email' input has "fake@email.com" as its value
  `
);

// ** OR  **

feature('My First Test (Gherkin syntax)', () => {
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


