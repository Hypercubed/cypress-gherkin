import { feature, scenario, given, when, then, and, gherkin } from '@hypercubed/cypress-gherkin';

import '../../support/gherkin-steps';

feature('Gherkin Syntax', () => {
  scenario('Navigate', () => {
    given('the user visits "https://example.cypress.io"');
    when('the user scrolls to the bottom of the page');
      and('scrolls to "type"');
      and('clicks on "type"');
    then('the url should be "https://example.cypress.io/commands/actions"');
      and('the title should be "Cypress.io: Kitchen Sink"');
      and('the title should not be "Cypress.io: Kitchen Sinks"');
  });

  scenario('Gherkin Syntax', () => {
    given('the user visits "https://example.cypress.io/commands/actions"');
      and('alias the element ".action-email" as "input"')
      and('focuses on "@input"')
    when('the user focuses on "@input"')
      and('types "fake@email.com"');
    then('"@input" should have value "fake@email.com"');
      and('"@input" should not have value "fake@gmail.com"');
  });
});

gherkin(`
Feature: Gherkin Text
  Scenario: Search
    Given the user visits "http://google.com"
    When the user types "Cypress"
      And presses enter
    Then the title should equal "Cypress - Google Search"
      And the url should contain "q=Cypress"
      And the title should equal "Cypress - Google Search"

  Scenario: Footer
    Given the user visits "http://www.google.com/search?q=Cypres"
      And get the element "#footcnt" as "footcnt"
    When the user scrolls to "@footcnt"
    Then "@footcnt" should be visible
      And "@footcnt" should exist
      And "@footcnt" should contain "Learn more"
`);
