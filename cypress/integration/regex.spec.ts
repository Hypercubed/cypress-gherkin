import { Given, feature, scenario, given, gherkin } from "../../src";

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
  },
  boolean(_: unknown) {
    expect(_).to.be.a('boolean');
  },
  option(_: unknown) {
    expect(_).to.be.a('string');
  }
}

Given(/^I have the string "([^"]*)?"$/, (_) => steps.string(_));

Given(/^I have the int (\-?[\d]+)$/, (_) => steps.int(Number(_)));

Given(/^I have the float (\-?[\d\.]+)$/, (_) => steps.float(Number(_)));

Given(/^I have the word ([^\s]+)$/, (_) => steps.word(_));

Given(/^I do( not)* have X/, (_) => steps.boolean(Boolean(_)));

Given(/^I (accept|cancel|close)/, (_) => steps.option(_));

feature('Parameters', () => {
  beforeEach(() => {
    cy.spy(steps, 'string').as('string');
    cy.spy(steps, 'int').as('int');
    cy.spy(steps, 'float').as('float');
    cy.spy(steps, 'word').as('word');
    cy.spy(steps, 'boolean').as('boolean');
    cy.spy(steps, 'option').as('option');
  });

  describe('gherkin syntax', () => {
    scenario('Navigates on click', () => {
      given('I have the string "hello world"');
      given('I have the int 3');
      given('I have the float -3.14159');
      given('I have the word hello');
      given('I do have X');
      given('I cancel');

      cy.get('@string').should('calledWith', 'hello world');
      cy.get('@int').should('calledWith', 3);
      cy.get('@float').should('calledWith', -3.14159);
      cy.get('@word').should('calledWith', 'hello');
      cy.get('@boolean').should('calledWith', false);
      cy.get('@option').should('calledWith', 'cancel');
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
              Given I do not have X
              Given I close
        `
      );

      cy.get('@string').should('calledWith', 'Goodbye Alderaan');
      cy.get('@int').should('calledWith', -2);
      cy.get('@float').should('calledWith', 2.71828);
      cy.get('@word').should('calledWith', 'Goodbye');
      cy.get('@boolean').should('calledWith', true);
      cy.get('@option').should('calledWith', 'close');
    });
  });
});