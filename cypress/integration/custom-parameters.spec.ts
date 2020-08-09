import { When, Then, feature, scenario, when, then, ParameterType, gherkin } from '../../src/index';

const notes = ["A", "B", "C", "D", "E", "F", "G"];

ParameterType({
  name: "note",
  regexp: new RegExp(notes.join("|"))
});

ParameterType({
  name: "ordinal",
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