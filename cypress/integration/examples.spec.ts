import { Given, When, Then, feature, gherkin, scenario, scenarioOutline, given, when, then, outline, examples } from '../../src/index';

let count: number;

const steps = {
  start: (initialCount: number) => {
    count = initialCount
  },
  eat: (eatCount: number) => {
    count -= eatCount
  },
  left: (expectedCount: number) => {
    assert.strictEqual(count, expectedCount)
  }
};

// @ts-ignore
Given('there are {int} cucumbers', (...args) => steps.start(...args));

// @ts-ignore
When('I eat {int} cucumbers', (...args) => steps.eat(...args));

// @ts-ignore
Then('I should have {int} cucumbers', (...args) => steps.left(...args));

feature('Calls steps', () => {
  beforeEach(() => {
    cy.spy(steps, 'start').as('start');
    cy.spy(steps, 'eat').as('eat');
    cy.spy(steps, 'left').as('left');
  });

  describe.skip('Examples Tables in Gherkin text', () => {
    beforeEach(() => {
      cy.stub(window, 'describe', (_name, fn) => fn()).as('describe');
      cy.stub(window, 'it', (_name, fn) => fn()).as('it');
      cy.stub(window, 'beforeEach', (fn) => fn()).as('beforeEach');
    });

    it('runs gherkin with example', () => {
      gherkin(
        `
          Feature: Examples Tables
            Scenario Outline: Navigates on click
              Given there are <start> cucumbers
              When I eat <eat> cucumbers
              Then I should have <left> cucumbers

            Examples: These are passing
              | start | eat | left |
              |    12 |   5 |    7 |
              |    20 |   6 |   14 |
      
            Examples: These are also passing
              | start | eat | left |
              |    22 |   7 |   15 |
              |    10 |   8 |    2 |
        `
      );

      cy.get('@describe').should('callCount', 2);
      cy.get('@it').should('callCount', 2);

      cy.get('@start').should('calledWith', 12);
      cy.get('@eat').should('calledWith', 5);
      cy.get('@left').should('calledWith', 7);

      cy.get('@start').should('calledWith', 20);
      cy.get('@eat').should('calledWith', 6);
      cy.get('@left').should('calledWith', 14);

      cy.get('@start').should('calledWith', 22);
      cy.get('@eat').should('calledWith', 7);
      cy.get('@left').should('calledWith', 15);

      cy.get('@start').should('calledWith', 10);
      cy.get('@eat').should('calledWith', 8);
      cy.get('@left').should('calledWith', 2);
    });
  });

  describe('Examples Tables in Gherkin syntax using scenarioOutline', () => {
    describe('using scenarioOutline and template literals', () => {
      scenario(`eating cucumbers, simple`, () => {
        given(`there are 24 cucumbers`);
        when(`I eat 14 cucumbers`);
        then(`I should have 10 cucumbers`);

        cy.get('@start').should('calledWith', 24);
        cy.get('@eat').should('calledWith', 14);
        cy.get('@left').should('calledWith', 10);
      });

      scenarioOutline(`eating cucumbers`, () => {
        outline(({start, eat, left}: any) => {
          given(`there are ${start} cucumbers`);
          when(`I eat ${eat} cucumbers`);
          then(`I should have ${left} cucumbers`);
          
          cy.get('@start').should('calledWith', start);
          cy.get('@eat').should('calledWith', eat);
          cy.get('@left').should('calledWith', left);
        });

        examples('These are passing', [
          ['start', 'eat', 'left'],
          [12,       5,    7],
          [20,       5,    15]
        ]);

        examples('These are also passing', [
          ['start', 'eat', 'left'],
          [12,       5,    7],
          [20,       5,    15]
        ]);      
      });
    });

    describe('using scenarioOutline', () => {
      scenarioOutline(`eating cucumbers`, () => {
        outline(() => {
          given(`there are <start> cucumbers`);
          when(`I eat <eat> cucumbers`);
          then(`I should have <left> cucumbers`);
        });
  
        examples('These are passing', [
          ['start', 'eat', 'left'],
          [12,       5,    7],
          [20,       5,    15]
        ]);
  
        examples('These are also passing', [
          ['start', 'eat', 'left'],
          [12,       5,    7],
          [20,       5,    15]
        ]);
      });
    });
  });
});