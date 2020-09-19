import { Given, When, Then, feature, scenario, gherkin, given, when, then, outline, scenarioOutline, examples } from '@hypercubed/cypress-gherkin';

let count: number;

Given('there are {int} cucumbers', (initialCount: number) => {
  count = initialCount
});

When('I eat {int} cucumbers', (eatCount: number) => {
  count -= eatCount
});

Then('I should have {int} cucumbers', (expectedCount: number) => {
  assert.strictEqual(count, expectedCount)
});

gherkin(`

  Feature: Example Tables in Gherkin text
    Sometimes it can be desireable to run the same scenario multiple times
    with different data each time. This can be done by placing an Examples
    section with an Examples Table underneath a Scenario, and use <placeholders>
    in the Scenario, matching the table headers.

    Scenario Outline: eating cucumbers
      Given there are <start> cucumbers
      When I eat <eat> cucumbers
      Then I should have <left> cucumbers

      Examples: These are passing
        | start | eat | left |
        |    12 |   5 |    7 |
        |    20 |   5 |   15 |

      Examples: These are also passing
        | start | eat | left |
        |    22 |   5 |   17 |
        |    10 |   5 |    5 |

`);

feature('Example Tables in Gherkin syntax', () => {
  describe(`eating cucumbers`, () => {
    const template = ([start, eat, left]: any[]) => {
      given(`there are ${start} cucumbers`);
      when(`I eat ${eat} cucumbers`);
      then(`I should have ${left} cucumbers`);
    };
    
    scenario(`These are passing`, () => {
      const example = [
        [12,       5,    7],
        [20,       5,    15]
      ];

      example.forEach(template);
    });

    scenario(`These are also passing`, () => {
      const example = [
        [22,       5,    17],
        [10,       5,     5]
      ];

      example.forEach(template);
    });
  });
});

feature('Example Tables in Gherkin syntax using scenarioOutline and template literals', () => {
  scenarioOutline(`eating cucumbers`, () => {
    outline(({start, eat, left}: any) => {
      given(`there are ${start} cucumbers`);
      when(`I eat ${eat} cucumbers`);
      then(`I should have ${left} cucumbers`);
    });

    examples('These are passing', [
      ['start', 'eat', 'left'],
      [12,       5,    7],
      [20,       5,    15]
    ]);

    examples('These are also passing', [
      ['start', 'eat', 'left'],
      [22,       5,    17],
      [10,       5,     5]
    ]);
  });
});

feature('Example Tables in Gherkin syntax using scenarioOutline without template literals', () => {
  scenarioOutline(`eating cucumbers`, () => {
    outline(() => {
      given('there are <start> cucumbers');
      when('I eat <eat> cucumbers');
      then('I should have <left> cucumbers');
    });

    examples('These are passing', [
      ['start', 'eat', 'left'],
      [12,       5,    7],
      [20,       5,    15]
    ]);

    examples('These are also passing', [
      ['start', 'eat', 'left'],
      [22,       5,    17],
      [10,       5,     5]
    ]);
  });
});
