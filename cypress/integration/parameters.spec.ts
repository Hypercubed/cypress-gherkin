import { Given, feature, scenario, given, gherkin } from '@hypercubed/cypress-gherkin';

const steps = {
  string(_: unknown) {
    expect(_).to.be.a('string')
  },
  int(_: unknown) {
    expect(_).to.be.a('number')
  },
  float(_: unknown) {
    expect(_).to.be.a('number')
  },
  word(_: unknown) {
    expect(_).to.be.a('string')
  }
}

Given('I have the string {string}', (_) => steps.string(_));

Given('I have the int {int}', (_) => steps.int(_));

Given('I have the float {float}', (_) => steps.float(_));

Given('I have the word {word}', (_) => steps.word(_));

feature('Parameters', () => {
  beforeEach(() => {
    cy.spy(steps, 'string').as('string');
    cy.spy(steps, 'int').as('int');
    cy.spy(steps, 'float').as('float');
    cy.spy(steps, 'word').as('word');
  });

  describe('gherkin syntax', () => {
    scenario('Navigates on click', () => {
      given('I have the string "hello world"');
      given('I have the int 3');
      given('I have the float -3.14159');
      given('I have the word hello');

      cy.get('@string').should('calledWith', 'hello world');
      cy.get('@int').should('calledWith', 3);
      cy.get('@float').should('calledWith', -3.14159);
      cy.get('@word').should('calledWith', 'hello');
    });
  });

  describe('gherkin text', () => {
    beforeEach(() => {
      cy.stub(window, 'describe', (_name, fn) => fn()).as('describe');
      cy.stub(window, 'it', (_name, fn) => fn()).as('it');
    });

    it('runs simple gherkin text', () => {
      gherkin(
        `
          Feature:
            Scenario:
              Given I have the string "Goodbye Alderaan"
              Given I have the int -2
              Given I have the float 2.71828
              Given I have the word Goodbye
        `
      );

      cy.get('@string').should('calledWith', 'Goodbye Alderaan');
      cy.get('@int').should('calledWith', -2);
      cy.get('@float').should('calledWith', 2.71828);
      cy.get('@word').should('calledWith', 'Goodbye');
    });
  });
});