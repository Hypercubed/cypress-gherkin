import { Given, When, Then, feature, gherkin, scenarioOutline, given, when, then } from '../../src/index';

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
    cy.spy(steps, 'start').as('background');
    cy.spy(steps, 'eat').as('visit');
    cy.spy(steps, 'left').as('click');
  });

  feature('Examples Tables in Gherkin syntax using scenarioOutline', () => {
    scenarioOutline(`eating cucumbers`, ({start, eat, left}: any) => {
      given(`there are ${start} cucumbers`);
      when(`I eat ${eat} cucumbers`);
      then(`I should have ${left} cucumbers`);

      expect(steps.start).to.have.calledWith(start);
      expect(steps.eat).to.have.calledWith(eat);
      expect(steps.left).to.have.calledWith(left);
    },
      [
        'These are passing',
        ['start', 'eat', 'left'],
        [12,       5,    7],
        [20,       5,    15]
      ],
      [
        'These are also passing',
        ['start', 'eat', 'left'],
        [22,       5,    17],
        [10,       5,     5]
      ]
    );
  });

  describe('gherkin text', () => {
    beforeEach(() => {
      cy.stub(window, 'describe', (_name, fn) => fn());
      cy.stub(window, 'it', (_name, fn) => fn());
      cy.stub(window, 'beforeEach', (fn) => fn());
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

      expect(window.describe).to.have.callCount(2);
      expect(window.it).to.have.callCount(2);

      expect(steps.start).to.have.calledWith(12);
      expect(steps.eat).to.have.calledWith(5);
      expect(steps.left).to.have.calledWith(7);

      expect(steps.start).to.have.calledWith(20);
      expect(steps.eat).to.have.calledWith(6);
      expect(steps.left).to.have.calledWith(14);

      expect(steps.start).to.have.calledWith(22);
      expect(steps.eat).to.have.calledWith(7);
      expect(steps.left).to.have.calledWith(15);

      expect(steps.start).to.have.calledWith(10);
      expect(steps.eat).to.have.calledWith(8);
      expect(steps.left).to.have.calledWith(2);
    });
  });
});