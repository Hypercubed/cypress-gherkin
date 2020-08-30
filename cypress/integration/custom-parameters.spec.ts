import { When, Then, feature, scenario, when, then, ParameterType, gherkin } from '../../src/index';

const notes = ["A", "B", "C", "D", "E", "F", "G"];

ParameterType({
  name: 'note',
  regexp: new RegExp(notes.join('|'))
});

ParameterType({
  name: 'ordinal',
  regexp: /(\d+)(?:st|nd|rd|th)/,
  transformer(s: string) {
    return parseInt(s, 10);
  }
});

let keySound: string;

const steps = {
  press: (n: number) => {
    keySound = notes[(n - 1) % 7];
  },
  hear: (note: string) => {
    expect(note).to.equal(keySound);
  }
};

When('I press the {ordinal} key of my piano', (n) => steps.press(n));

Then('I should hear a(n) {note} sound', (note) => steps.hear(note));

// ** OR  **

describe('Custom Parameters', () => {
  beforeEach(() => {
    cy.spy(steps, 'press').as('press');
    cy.spy(steps, 'hear').as('hear');
  });

  feature('Custom Parameter Types in Gherkin Syntax', () => {
    scenario('Play an A on my piano', () => {
      when('I press the 1st key of my piano');
      then('I should hear an A sound');

      cy.get('@press').should('calledWith', 1);
      cy.get('@hear').should('calledWith', 'A');
    });

    scenario('Play an B on my piano', () => {
      when('I press the 23th key of my piano');
      then('I should hear a B sound');

      cy.get('@press').should('calledWith', 23);
      cy.get('@hear').should('calledWith', 'B');
    });
  });

  describe('gherkin text', () => {
    beforeEach(() => {
      cy.stub(window, 'describe', (_name, fn) => fn()).as('describe');
      cy.stub(window, 'it', (_name, fn) => fn()).as('it');
      cy.stub(window, 'beforeEach', (fn) => fn()).as('beforeEach');
    });

    it('runs gherkin text', () => {
      gherkin(
        `
        Feature: Custom Parameter Types in Gherkin Text
      
          As a cucumber cypress plugin which handles Custom Parameter Types
          I want to allow people to add custom parameter types and use them into their step definitions
        
          Scenario: Play an A on my piano
            When I press the 1st key of my piano
            Then I should hear an A sound
        
          Scenario: Play an E on my piano
            When I press the 26th key of my piano
            Then I should hear an E sound
        `
      );

      cy.get('@describe').should('callCount', 1);
      cy.get('@it').should('callCount', 2);

      cy.get('@press').should('calledWith', 1);
      cy.get('@hear').should('calledWith', 'A');

      cy.get('@press').should('calledWith', 26);
      cy.get('@hear').should('calledWith', 'E');
    });
  });
});
