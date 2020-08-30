import { When, gherkin, feature, scenario, given } from "../../src/index";

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

  feature.skip('a feature name', () => {
    scenario('a scenario name', () => {
      given('a ambiguous step');
    });
  });
});
