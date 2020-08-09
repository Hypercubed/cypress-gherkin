import { feature, scenario, given, when, then, and, gherkin, setupCommon } from '../../src/index';

setupCommon();

gherkin(
  `
    Feature: Using common phases in Gherkin text
      Scenario: First person
        Given I visit "https://example.cypress.io"
          And I see "Cypress" in the title
        When I scroll to the bottom of the page
          And I scroll to the top of the page
          And I click "type"
        Then I should be on the "/commands/actions" page
          And I type "fake@email.com" in ".action-email"
          And ".action-email" has "fake@email.com" as its value

      Scenario: A user
        Given a user opens the "https://example.cypress.io" page
          And they see "Cypress" in the window title
        When the user scrolls to the bottom
          And the user scrolls to the top
          And they click the "type" link
          And they should be on "/commands/actions"
        Then the user types "fake@email.com" into ".action-email" element
          And the ".action-email" element has "fake@email.com" as its value
  `
);

// ** OR  **

feature('Using common phases in Gherkin style', () => {
  scenario('First person', () => {
    given('I visit "https://example.cypress.io"');
      and('I see "Cypress" in the title');
    when('I scroll to the bottom of the page');
      and('I scroll to the top of the page');
      and('I click "type"');
    then('I should be on the "/commands/actions" page');
      and('I type "fake@email.com" in ".action-email"');
      and('".action-email" has "fake@email.com" as its value');
  });

  scenario('A user', () => {
    given('a user opens the "https://example.cypress.io" page');
      and('they see "Cypress" in the window title');
    when('the user scrolls to the bottom');
      and('the user scrolls to the top');
      and('they click the "type" link');
    then('they should be on "/commands/actions"');
      and('the user types "fake@email.com" into ".action-email" element');
      and('the ".action-email" element has "fake@email.com" as its value');
  });
});




