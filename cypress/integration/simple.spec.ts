import { Given, When, Then, feature, scenario, given, when, then, gherkin } from '../../src/index';

const steps = {
  background: () => {
    cy.log('background');
  },
  visit: (s: string) => {
    return cy.visit(s);
  },
  click: (s: string) => {
    return cy.get('a').contains(s).click();
  },
  type: (e: string, s: string) => {
    return cy.get(s).type(e);
  },
  url: (s: string) => {
    return cy.url().should('include', s);
  },
  value: (e: string, s: string) => {
    return cy.get(e).should('have.value', s);
  }
};

// @ts-ignore
Given('a background', (...args) => steps.background(...args));

// @ts-ignore
Given('a user visits {string}', (...args) => steps.visit(...args));

// @ts-ignore
When('they click the link labeled {string}', (...args) => steps.click(...args));

// @ts-ignore
When('they type {string} into the {string} input', (...args) => steps.type(...args));

// @ts-ignore
Then('the URL should include {string}', (...args) => steps.url(...args));

// @ts-ignore
Then('the {string} input has {string} as its value', (...args) => steps.value(...args));

feature('Calls steps', () => {
  beforeEach(() => {
    cy.spy(steps, 'background').as('background');
    cy.spy(steps, 'visit').as('visit');
    cy.spy(steps, 'click').as('click');
    cy.spy(steps, 'type').as('type');
    cy.spy(steps, 'url').as('url');
    cy.spy(steps, 'value').as('value');
  });

  describe('gherkin syntax', () => {
    scenario('Navigates on click', () => {
      given('a user visits "https://example.cypress.io"');
      when('they click the link labeled "type"');
      then('the URL should include "/commands/actions"');

      cy.get('@visit').should('calledWith', 'https://example.cypress.io');
      cy.get('@click').should('calledWith', 'type');
      cy.get('@url').should('calledWith', '/commands/actions');
    });

    scenario('Types and asserts', () => {
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
    });

    it('runs simple gherkin text', () => {
      gherkin(
        `
          Feature: My First Test (Gherkin text)

            Background:
              Given a background

            Rule: A
              Scenario: Navigates on click
                Given a user visits "https://example.cypress.io"
                When they click the link labeled "type"
                Then the URL should include '/commands/actions'

              Scenario: Types and asserts
                Given a user visits "https://example.cypress.io/commands/actions"
                When they type "fake@email.com" into the ".action-email" input
                Then the '.action-email' input has "fake@email.com" as its value
        `
      );

      cy.get('@describe').should('callCount', 2);
      cy.get('@beforeEach').should('callCount', 1);
      cy.get('@it').should('callCount', 2);

      cy.get('@background').should('callCount', 1);

      cy.get('@visit').should('calledWith', 'https://example.cypress.io');
      cy.get('@click').should('calledWith', 'type');
      cy.get('@url').should('calledWith', '/commands/actions');

      cy.get('@visit').should('calledWith', 'https://example.cypress.io/commands/actions');
      cy.get('@type').should('calledWith', 'fake@email.com', '.action-email');
      cy.get('@value').should('calledWith', '.action-email', 'fake@email.com');
    });
  });
});




