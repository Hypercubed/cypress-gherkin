import { Given, When, Then, feature, scenario, gherkin, given, when, then, outline, scenarioOutline } from '../../src/index';

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

  Feature: Examples Tables
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

feature('Examples Tables in Gherkin syntax', () => {
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

feature('Examples Tables in Gherkin outline', () => {
  const template = ({start, eat, left}: any) => {
    given(`there are ${start} cucumbers`);
    when(`I eat ${eat} cucumbers`);
    then(`I should have ${left} cucumbers`);
  };

  describe(`eating cucumbers`, () => { 
    outline(`These are passing`, template, [
      ['start', 'eat', 'left'],
      [12,       5,    7],
      [20,       5,    15]
    ]);

    outline(`These are also passing`, template, [
      ['start', 'eat', 'left'],
      [12,       5,    7],
      [20,       5,    15]
    ]);
  });
});

feature('Examples Tables in Gherkin syntax using scenarioOutline', () => {
  scenarioOutline(`eating cucumbers`, ({start, eat, left}: any) => {
    given(`there are ${start} cucumbers`);
    when(`I eat ${eat} cucumbers`);
    then(`I should have ${left} cucumbers`);
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


