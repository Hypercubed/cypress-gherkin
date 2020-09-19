import { When, Then, feature, scenario, and, when, then, gherkin } from '@hypercubed/cypress-gherkin';

const steps = {
  when(alias: string, value: string) {
    cy.wrap(value).as(alias);
  },
  then(alias: string, value: string) {
    cy.get(`@${alias}`).then(val => {
      expect(val).to.equal(value);
    });
  },
  and(this: Cypress.ObjectLike, alias: string, value: string) {
    expect(this[alias]).to.equal(value);
  }
}

When('I set {string} alias to {string}', (a, b) => steps.when(a, b));

Then('cy.get {string} returns {string}', function (this: Cypress.ObjectLike, a, b) { steps.then.call(this, a, b) });

Then('this {string} is set to {string}', function (this: Cypress.ObjectLike, a, b) { steps.and.call(this, a, b) });

describe('Context', () => {
  beforeEach(() => {
    cy.spy(steps, 'when').as('When');
    cy.spy(steps, 'then').as('Then');
    cy.spy(steps, 'and').as('And');
  });

  describe('gherkin text', () => {
    beforeEach(() => {
      cy.stub(window, 'describe', (_name, fn) => fn()).as('describe');
      cy.stub(window, 'it', (_name, fn) => fn()).as('it');
      cy.stub(window, 'beforeEach', (_name, fn) => fn()).as('beforeEach');
    });

    it('runs gherkin text', () => {
      gherkin(
        `
        Feature: Context sharing in Gherkin text
          Scenario: Sharing
            When I set "hello" alias to "world"
            Then cy.get "hello" returns "world"
              And this "hello" is set to "world"
        `
      );

      cy.get('@describe').should('callCount', 1);
      cy.get('@beforeEach').should('callCount', 0);
      cy.get('@it').should('callCount', 1);

      cy.get('@When').should('callCount', 1);
      cy.get('@Then').should('callCount', 1);
      cy.get('@And').should('callCount', 1);

      cy.get('@When').should((_: any) => {
        const arg = _.firstCall.args;
        expect(arg).to.deep.eq(['hello', 'world']);
      });

      cy.get('@Then').should((_: any) => {
        const arg = _.firstCall.args;
        expect(arg).to.deep.eq(['hello', 'world']);
      });

      cy.get('@And').should((_: any) => {
        const arg = _.firstCall.args;
        expect(arg).to.deep.eq(['hello', 'world']);
      });
    });
  });

  describe('gherkin syntax', () => {
    feature('Context sharing in Gherkin syntax', () => {
      scenario('Sharing', () => {
        when('I set "goodbye" alias to "Alderaan"');
        then('cy.get "goodbye" returns "Alderaan"');
          and('this "goodbye" is set to "Alderaan"')

        cy.get('@When').should('callCount', 1);
        cy.get('@Then').should('callCount', 1);
        cy.get('@And').should('callCount', 1);

        cy.get('@When').should((_: any) => {
          const arg = _.firstCall.args;
          expect(arg).to.deep.eq(['goodbye', 'Alderaan']);
        });
  
        cy.get('@Then').should((_: any) => {
          const arg = _.firstCall.args;
          expect(arg).to.deep.eq(['goodbye', 'Alderaan']);
        });

        cy.get('@And').should((_: any) => {
          const arg = _.firstCall.args;
          expect(arg).to.deep.eq(['goodbye', 'Alderaan']);
        });
      });
    });
  });
});
