import { feature, scenario, given, when, then, and, gherkin } from '../../../src/index';

import '../../support/gherkin-steps/bdd';
import '../../support/gherkin-steps/chai-jquery';
import '../../support/gherkin-steps/cy-commands';

gherkin(`
Feature: Gherkin Text
  Scenario: Search
    Given I visit "http://google.com"
      And the title is "Google"
    When I type "Cypress" in the element "[name=\'q\']"
      And I press "Enter"
    Then the title should be "Cypress - Google Search"
      And the url contains "q=Cypress"

  Scenario: Footer
    Given I visit "http://www.google.com/search?q=Cypres"
      And I scroll to the element "#fbar"
    Then the element "#fbar" is visible
      And the element "#fbar" does exist
      And the element "#fbar" contains "Learn more"
`);

feature('Using common phrases in Gherkin style', () => {
  scenario('Gherkin Syntax', () => {
    given('I visit "https://example.cypress.io"');
      and('the title should be "Cypress.io: Kitchen Sink"');
      and('the title should not be "Cypress.io: Kitchen Sinks"');
    when('I scroll to the bottom of the page');
      and('I scroll to the top of the page');
      // and(`I click on the link "a[href='/commands/actions']:first-child"`);
      cy.get('a').contains('type').click();
      and('I type "fake@email.com" in the element ".action-email"');
    then('the url should be "https://example.cypress.io/commands/actions"');
      and('the element ".action-email" has value "fake@email.com"');
  });
});




