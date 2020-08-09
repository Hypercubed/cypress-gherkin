import { Given, When, Then, feature, scenario, given, when, then, and, gherkin } from '../../src/index';

Given('I go to the actions page', () => {
  cy.visit('https://example.cypress.io/commands/actions');
});

When('I type {string} into the {string} input', (e: string, s: string) => {
  cy.get(s).as('control');
  cy.get('@control').type(e);
  cy.wrap(e).as('input')
});

Then('I see the input', () => {
  cy.get('@input').then(input => {
    cy.get('@control').should('have.value', input);
  });
});

gherkin(
  `
  Feature: Context sharing in Gherkin text
    Scenario: Sharing
      Given I go to the actions page
      When I type "hello" into the ".action-email" input
      Then I see the input
  `
);

// ** OR  **

feature('Context sharing in Gherkin syntax', () => {
  scenario('Sharing', () => {
    given('I go to the actions page');
    when('I type "hello" into the ".action-email" input');
    then('I see the input');
  });
});