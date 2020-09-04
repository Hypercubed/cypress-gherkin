import { feature, scenario, given, when, then, and, gherkin } from '../../src/index';

import '../support/gherkin-steps';

feature('Using common phrase', () => {
  scenario('Gherkin Syntax', () => {
    given('the user visits "https://example.cypress.io"');
      and('the title should be "Cypress.io: Kitchen Sink"');
      and('the title should not be "Cypress.io: Kitchen Sinks"');
      and('alias the element containing "type" as "link"');
    when('the user scrolls to the bottom of the page');
      and('scrolls to the top of the page');
      and(`clicks on the element "@link"`);
      and('types "fake@email.com" in the element ".action-email"');
    then('the url should be "https://example.cypress.io/commands/actions"');
      and('the element ".action-email" should have value "fake@email.com"');
      and('".action-email" should not have value "fake@gmail.com"');
  });

  gherkin(`
  Feature: Gherkin Text
    Scenario: Search
      Given the user visits "http://google.com"
        And the title should equal "Google"
      When the user types "Cypress" in the element "[name=\'q\']"
        And presses enter
      Then the title should equal "Cypress - Google Search"
        And the url should contain "q=Cypress"
  
    Scenario: Footer
      Given the user visits "http://www.google.com/search?q=Cypres"
        And scrolls to the element "#fbar"
      Then alias the element "#footcnt .fbar" as "fbar"
        And "@fbar" should be visible
        And "@fbar" should exist
        And "@fbar" should contain "Learn more"
  `);
});

