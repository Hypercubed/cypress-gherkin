import { Given, feature, scenario, given, then, gherkin } from '@hypercubed/cypress-gherkin';

// Given('{airport} is closed because of a strike', (_airport: any) => {
//   throw new Error('Should not be called because airport type not defined')
// });

describe('errors', () => {
  it('throws on undefined parameter', () => {
    expect(() => {
      Given('{airport} is closed because of a strike', (airport: any) => {
        throw new Error(`Should not be called because ${airport} type not defined`)
      });
    }).to.throw('Undefined parameter type {airport}');
  });

  gherkin.skip(
    `
      Feature: My First Test (from Gherkin text)
        Scenario: Navigates on click
          Given I visit "https://example.cypress.io"

        Scenario: Types and asserts
          When I type "fake@email.com" into the ".action-email" input
    `
  );

  // ** OR  **

  feature('My First Test (from Gherkin style)', () => {
    it('Navigates on click', () => {
      cy.failsWith(() => {
        then('the URL should include "/commands/actions"');
      }, 'Missing Gherkin statement');
    });

    it('Types and asserts', () => {
      cy.failsWith(() => {
        given('a user visits "https://example.cypress.io/commands/actions"');
      }, 'Missing Gherkin statement');
    });

    it('Missing type', () => {
      cy.failsWith(() => {
        given('a {user} visits "https://example.cypress.io/commands/actions"');
      }, 'Missing Gherkin statement');
    });
  });
});
