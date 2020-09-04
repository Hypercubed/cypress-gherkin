import { feature, scenario, given, when, then, and, gherkin } from '../../../src/index';

import '../../support/gherkin-steps';

gherkin(`
Feature: Using common phrases in Gherkin  Text
  Scenario: Search
    Given the user visits "http://google.com"
      And the title should be "Google"
    When the user types "Cypress" in the element "[name=\'q\']"
      And presses enter
    Then the title should be "Cypress - Google Search"
      And the url should contain "q=Cypress"

  Scenario: Footer
    Given the user visits "http://www.google.com/search?q=Cypres"
      And scrolls to the element "#fbar"
    Then the element "#fbar" should be visible
      And "#fbar" should exist
      And "#fbar" should contain "Learn more"
`);

feature('Using common phrases in Gherkin style', () => {
  scenario('Gherkin Syntax', () => {
    given('the user visits "https://example.cypress.io"');
      and('the title should equal "Cypress.io: Kitchen Sink"');
      and('the title should not equal "Cypress.io: Kitchen Sinks"');
      and(`alias the element containing "type" as "link"`);
    when('the user scrolls to the bottom of the page');
      and('scrolls to the top of the page');
      and(`clicks on the element "@link"`);
      and('types "fake@email.com" in the element ".action-email"');
    then('the url should contain "/commands/actions"');
      and('".action-email" should have value "fake@email.com"');
  });
});
