import { Given, When, Then, feature, scenario, background, given, when, then, outline } from '../../src/index';

const fruitToJuice: any = {
  apple: 'apple juice',
  pineapple: 'pineapple juice',
  strawberry: 'strawberry juice'
};

let juice = "";

Given("I put {string} in a juicer", (fruit: string) => {
  juice = fruitToJuice[fruit];
  expect(typeof juice).to.equal("string");
});

When("I switch it on", () => {
  expect(true).to.equal(true);
});

Then("I should get {string}", (resultJuice: string) => {
  expect(resultJuice).to.equal(juice);
});

// Feature: Being a plugin handling Scenario Outline
//
//   As a cucumber cypress plugin which handles Scenario Outline
//   I want to allow people to write Scenario Outline tests and run it in cypress
//
//   Scenario Outline: Use juicer with <fruit>
//     Given I put "<fruit>" in a juicer
//     When I switch it on
//     Then I should get "<juice>"

//     Examples:
//       | fruit      | juice            |
//       | apple      | apple juice      |
//       | pineapple  | pineapple juice  |
//       | strawberry | strawberry juice |

feature('Using examples in Gherkin syntax', () => {
  const examples: any = [
    ['apple', 'apple juice'],
    ['pineapple', 'pineapple juice'],
    ['strawberry', 'strawberry juice'],
  ];

  examples.forEach(([fruit, juice]: string[]) => {
    scenario(`Use juicer with ${fruit}`, () => {
      given(`I put "${fruit}" in a juicer`);
      when(`I switch it on`);
      then(`I should get "${juice}"`);
    });
  });
});

feature('Using Scenario Outline in Gherkin syntax', () => {

  const examples: any = [
    ['fruit', 'juice'],
    ['apple', 'apple juice'],
    ['pineapple', 'pineapple juice'],
    ['strawberry', 'strawberry juice'],
  ];

  outline(({fruit, juice}: {fruit: string, juice: string}) => {
    scenario(`Use juicer with ${fruit}`, () => {
      given(`I put "${fruit}" in a juicer`);
      when(`I switch it on`);
      then(`I should get "${juice}"`);
    });
  }, examples);
});

// Feature: Being a plugin handling Scenario Outline

//   As a cucumber cypress plugin which handles Scenario Outline
//   I want to allow people to write Scenario Outline tests and run it in cypress

//   Scenario Outline: Using Scenario Outlines
//     When I add <provided number> and <another provided number>
//     Then I verify that the result is equal the <provided>

//     Examples:
//       | provided number | another provided number | provided |
//       | 1               | 2                       | 3        |
//       | 100             | 200                     | 300      |

let sum = 0;

When(`I add {int} and {int}`, (a: number, b: number) => {
  sum = a + b;
});

Then(`I verify that the result is equal to {int}`, (result: number) => {
  expect(sum).to.equal(result);
});

feature('Scenario Outline', () => {
  const examples: any = [
    [1, 2, 3],
    [100, 200, 300]
  ];
  scenario(`Using Scenario Outlines`, () => {
    examples.forEach(([a, b, c]: any) => {
      given(`I add ${a} and ${b}`);
      then(`I verify that the result is equal to ${c}`);
    });
  });
});

feature('Scenario Outline', () => {
  const examples: any = [
    ['provided_number', 'another_provided_number', 'provided'],
    [1, 2, 3],
    [100, 200, 300]
  ];
  scenario(`Using Scenario Outlines`, () => {
    outline(({provided_number, another_provided_number, provided}: any) => {
      given(`I add ${provided_number} and ${another_provided_number}`);
      then(`I verify that the result is equal to ${provided}`);
    }, examples);
  });
});

