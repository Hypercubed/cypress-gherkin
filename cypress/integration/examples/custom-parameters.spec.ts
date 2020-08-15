import { Given, When, Then, feature, scenario, when, then, ParameterType, gherkin } from '../../../src/index';

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

When('I press the {ordinal} key of my piano', (n: number) => {
  keySound = notes[(n - 1) % 7];
});

Then('I should hear a(n) {note} sound', (note: string) => {
  expect(note).to.equal(keySound);
});

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

// ** OR  **

feature('Custom Parameter Types in Gherkin Syntax', () => {
  scenario('Play an A on my piano', () => {
    when('I press the 1st key of my piano');
    then('I should hear an A sound');
  });

  scenario('Play an B on my piano', () => {
    when('I press the 23th key of my piano');
    then('I should hear a B sound');
  });
});


class Flight {
  constructor(public readonly from: string, public readonly to: string) {}
}

ParameterType({
  name: 'flight',
  regexp: /([A-Z]{3})-([A-Z]{3})/,
  transformer(from: string, to: string) {
    return new Flight(from, to)
  },
})

Given('{flight} has been delayed {int} minutes', (
  flight: Flight,
  delay: number
) => {
  assert.equal(flight.from, 'LHR')
  assert.equal(flight.to, 'CDG')
  assert.equal(delay, 45)
})

gherkin(`
Feature: Parameter Types
  Cucumber lets you define your own parameter types, which can be used
  in Cucumber Expressions. This lets you define a precise domain-specific
  vocabulary which can be used to generate a glossary with examples taken
  from your scenarios. They also let you transform strings and tables into
  rich types.

  Scenario: flights
    Given LHR-CDG has been delayed 45 minutes
`);