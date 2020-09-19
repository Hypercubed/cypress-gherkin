import { When, gherkin, feature, scenario, given } from "@hypercubed/cypress-gherkin";

When('a ambiguous step', () => {
  // nop
});

When(/^a (.*) step$/, () => {
  // nop
});

describe('throws errors on ambigious steps', () => {
  gherkin.skip(`

    Feature: a feature name
    Scenario: a scenario name
      Given a ambiguous step

  `);

  feature('a feature name', () => {
    scenario('a scenario name', () => {
      cy.failsWith(() => {
        given('a ambiguous step');
      }, 'Multiple step definitions match');
    });

    scenario('a scenario name', () => {
      given('a unambiguous step');
    });
  });
});
