import { feature, scenario, given, when, then, and, gherkin } from '../../src/index';
// import '../support/gherkin-steps/common';
import '../support/gherkin-steps/boilerplate-given';
import '../support/gherkin-steps/boilerplate-when';
import '../support/gherkin-steps/boilerplate-then';

feature('Using common phrases in Gherkin style', () => {
  scenario('First person', () => {
    given('I open the url "https://example.cypress.io"');
      and('the title is "Cypress.io: Kitchen Sink"');
      and('the title is not "Cypress.io: Kitchen Sinks"');
    when('I scroll to the bottom of the page');
      and('I scroll to the top of the page');
      // and(`I click on the link "a[href='/commands/actions']:first-child"`);
      cy.get('a').contains('type').click();
      and('I type "fake@email.com" to the field ".action-email"');
    then('the url is "https://example.cypress.io/commands/actions"');
      and('the field ".action-email" contains the text "fake@email.com"');
  });

  scenario('Google', () => {
    given('I open the url "http://google.com"');
      and('the title is "Google"');

    when('I type "Cypress" to the field "[name=\'q\']"');
      and('I press "Enter"');

    then('the title is "Cypress - Google Search"');

    given('I pause for 100ms');
    when('I scroll to the element "#fbar"');
    then('the element "#fbar" is visible');
      and('the element "#fbar" does exist');
      and('the element "#fbar" contains the text "Learn more"');
  });
});