import { Given, When, Then, feature, scenario, given, when, then, gherkin, background } from '../../src/index';

const steps = {
  background() {
    cy.log('background');
  },
  visit(s: string) {
    return cy.visit(s);
  },
  click(s: string) {
    return cy.get('a').contains(s).click();
  },
  type(e: string, s: string) {
    return cy.get(s).type(e);
  },
  url(s: string) {
    return cy.url().should('include', s);
  },
  value(e: string, s: string) {
    return cy.get(e).should('have.value', s);
  }
};

Given('a background', () => steps.background());

Given('a user visits {string}', (s) => steps.visit(s));

When('they click the link labeled {string}', (s) => steps.click(s));

When('they type {string} into the {string} input', (e, s) => steps.type(e, s));

Then('the URL should include {string}', (s) => steps.url(s));

Then('the {string} input has {string} as its value', (e, s) => steps.value(e, s));

feature('Tags', () => {
  beforeEach(() => {
    cy.spy(steps, 'background').as('background');
    cy.spy(steps, 'visit').as('visit');
    cy.spy(steps, 'click').as('click');
    cy.spy(steps, 'type').as('type');
    cy.spy(steps, 'url').as('url');
    cy.spy(steps, 'value').as('value');
  });

  describe('gherkin syntax', () => {
    background(() => {
      given('a user visits "https://example.cypress.io"');
    });

    scenario('Navigates on click', () => {
      when('they click the link labeled "type"');
      then('the URL should include "/commands/actions"');

      cy.get('@visit').should('calledWith', 'https://example.cypress.io');
      cy.get('@click').should('calledWith', 'type');
      cy.get('@url').should('calledWith', '/commands/actions');
    });

    scenario.skip('Types and asserts', () => {
      given('a user visits "https://example.cypress.io/commands/actions"');
      when('they type "fake@email.com" into the ".action-email" input');
      then('the ".action-email" input has "fake@email.com" as its value');

      cy.get('@visit').should('calledWith', 'https://example.cypress.io/commands/actions');
      cy.get('@type').should('calledWith', 'fake@email.com', '.action-email');
      cy.get('@value').should('calledWith', '.action-email', 'fake@email.com');
    });    
  });

  describe('gherkin text', () => {
    beforeEach(() => {
      cy.stub(window, 'describe', (_name, fn) => fn()).as('describe');
      cy.stub(window, 'it', (_name, fn) => fn()).as('it');
      cy.stub(window, 'beforeEach', (_name, fn) => fn()).as('beforeEach');

      cy.stub(window.describe, 'only', (_name, fn) => fn()).as('describe_only');
      cy.stub(window.it, 'only', (_name, fn) => fn()).as('it_only');
      cy.stub(window.it, 'skip', (_name, _fn) => {
        // nop
      }).as('it_skip');
    });

    it('runs simple gherkin text', () => {
      gherkin(
        `
          @only
          Feature: My First Test (Gherkin text)

            Background:
              Given a background

            Rule: A
              @only
              Scenario: Navigates on click
                Given a user visits "https://example.cypress.io"
                When they click the link labeled "type"
                Then the URL should include '/commands/actions'

              @skip
              Scenario: Types and asserts
                Given a user visits "https://example.cypress.io/commands/actions"
                When they type "fake@email.com" into the ".action-email" input
                Then the '.action-email' input has "fake@email.com" as its value
        `
      );

      cy.get('@describe').should('callCount', 1);
      cy.get('@describe_only').should('callCount', 1);

      cy.get('@beforeEach').should('callCount', 1);
      cy.get('@it').should('callCount', 0);
      cy.get('@it_only').should('callCount', 1);
      cy.get('@it_skip').should('callCount', 1);

      cy.get('@background').should('callCount', 1);

      cy.get('@visit').should('callCount', 1);
      cy.get('@click').should('callCount', 1);
      cy.get('@url').should('callCount', 1);

      cy.get('@visit').should('calledWith', 'https://example.cypress.io');
      cy.get('@click').should('calledWith', 'type');
      cy.get('@url').should('calledWith', '/commands/actions');
    });
  });
});




