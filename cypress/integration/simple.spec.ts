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

      expect(steps.visit).to.be.calledWith('https://example.cypress.io');
      expect(steps.click).to.be.calledWith('type');
      expect(steps.url).to.be.calledWith('/commands/actions');
    });

    scenario('Types and asserts', () => {
      given('a user visits "https://example.cypress.io/commands/actions"');
      when('they type "fake@email.com" into the ".action-email" input');
      then('the ".action-email" input has "fake@email.com" as its value');

      expect(steps.visit).to.be.calledWith('https://example.cypress.io/commands/actions');
      expect(steps.type).to.be.calledWith('fake@email.com', '.action-email');
      expect(steps.value).to.be.calledWith('.action-email', 'fake@email.com');
    });    
  });

  describe('gherkin text', () => {
    beforeEach(() => {
      cy.stub(window, 'describe', (_name, fn) => fn());
      cy.stub(window, 'it', (_name, fn) => fn());
      cy.stub(window, 'beforeEach', (fn) => fn());
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

      expect(window.describe).to.have.callCount(2);
      expect(window.beforeEach).to.have.callCount(1);
      expect(window.it).to.have.callCount(2);

      expect(steps.background).to.have.callCount(1);

      expect(steps.visit).to.have.calledWith('https://example.cypress.io');
      expect(steps.click).to.be.calledWith('type');
      expect(steps.url).to.be.calledWith('/commands/actions');

      expect(steps.visit).to.have.calledWith('https://example.cypress.io/commands/actions');
      expect(steps.type).to.be.calledWith('fake@email.com', '.action-email');
      expect(steps.value).to.be.calledWith('.action-email', 'fake@email.com');
    });
  });
});




