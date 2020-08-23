// @ts-ignore
import { Given, feature, scenario, given, when, then, gherkin } from '../../src/index';

describe('errors', () => {
  it('throws on undefined parameter', () => {
    expect(() => {
      Given('{airport} is closed because of a strike', (airport: any) => {
        throw new Error(`Should not be called because ${airport} type not defined`)
      });
    }).to.throw('Undefined parameter type {airport}');
  });
});

// Given('{airport} is closed because of a strike', (_airport: any) => {
//   throw new Error('Should not be called because airport type not defined')
// });

gherkin.skip(
  `
    Feature: My First Test (from Gherkin text)
      Scenario: Navigates on click
        Given I visit "https://example.cypress.io"

      Scenario: Types and asserts
        When I type "fake@email.com" into the ".action-email" input
  `
);

// // ** OR  **

feature.skip('My First Test (from Gherkin style)', () => {
  scenario('Navigates on click', () => {
    then('the URL should include "/commands/actions"');
  });

  scenario('Types and asserts', () => {
    given('a user visits "https://example.cypress.io/commands/actions"');
  });

  scenario('Missing type', () => {
    given('a {user} visits "https://example.cypress.io/commands/actions"');
  });
});


