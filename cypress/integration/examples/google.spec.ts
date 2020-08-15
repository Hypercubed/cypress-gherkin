import { Given, Then, feature, scenario, given, then, gherkin } from '../../../src/index';

const url = 'https://google.com'
Given('I open Google page', () => {
  return cy.visit(url)
});

Then(`I see {string} in the title`, (title: string) => {
  return cy.title().should('include', title)
});

gherkin(
  `
  Feature: The Google
    Scenario: Opening a page
      Given I open Google page
      Then I see "Google" in the title
  `
);

// ** OR  **

feature('The Google', () => {
  scenario('Opening a page', () => {
    given('I open Google page');
    then('I see "Google" in the title');
  });
});