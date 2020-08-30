import { feature, scenario, given, when, then, and, gherkin } from '../../../src/index';

import '../../support/gherkin-steps/bdd';
import '../../support/gherkin-steps/chai-jquery';
import '../../support/gherkin-steps/cy-commands';

gherkin(`
Feature: Using common phrases in Gherkin  Text
  Scenario: Search
    Given the user visits "http://google.com"
      And the title is "Google"
    When the user types "Cypress" in the element "[name=\'q\']"
      And the user presses "Enter"
    Then the title is "Cypress - Google Search"
      And the url contains "q=Cypress"

  Scenario: Footer
    Given the user visits "http://www.google.com/search?q=Cypres"
      And the user scrolls to the element "#fbar"
    Then the element "#fbar" is visible
      And the element "#fbar" exists
      And the element "#fbar" contains "Learn more"
`);

feature('Using common phrases in Gherkin style', () => {
  scenario('Gherkin Syntax', () => {
    given('the user visits "https://example.cypress.io"');
      and('the title is "Cypress.io: Kitchen Sink"');
      and('the title is not "Cypress.io: Kitchen Sinks"');
    when('the user scrolls to the bottom of the page');
      and('the user scrolls to the top of the page');
      // and(`the user click on the link "a[href='/commands/actions']:first-child"`);
      cy.get('a').contains('type').click();
      and('the user types "fake@email.com" in the element ".action-email"');
    then('the url is "https://example.cypress.io/commands/actions"');
      and('the element ".action-email" has value "fake@email.com"');
  });
});
