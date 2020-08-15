import { Given, When, Then, feature, scenario, given, then, and } from '../../../src/index';

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

Then('the {string} input should:', (e: string, fn: string) => {
  return cy.get(e).should(fn);
});

describe('Gherkin syntax mixed with Cypress', () => {
  before(( )=> {
    given('a user visits "https://example.cypress.io"')
  });

  scenario('Navigates on click', () => {
    cy.get('a').contains('type').click();
    then('the URL should include "/commands/actions"');
  });

  feature('a feature', () => {
    beforeEach(() => {
      given('a user visits "https://example.cypress.io/commands/actions"').then(() => {
        and('they type "fake@email.com" into the ".action-email" input');
      });      
    });

    it('Types and asserts', () => {
      then('the ".action-email" input has "fake@email.com" as its value')
        .and('have.class', 'form-control');

      then('the ".action-email" input should:', ($e: any) => {
        expect($e).to.have.value("fake@email.com");
      });
    });
  });
});


