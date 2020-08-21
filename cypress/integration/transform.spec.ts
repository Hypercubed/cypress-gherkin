import { transform, clear } from '../../src/transform';

function expectEqualIgnoreSpaces(str1: string, str2: string) {
  const _str1 = str1.trim().split('\n').map(s => s.trim());
  const _str2 = str2.trim().split('\n').map(s => s.trim());

  _str1.forEach((line1, index) => {
    const line2 = _str2[index];
    if (line1 !== '' || line2 !== '') {
      expect(line1).equals(line2, `line ${index}`);
    }
  });
}

describe('transforms', () => {
  it('Simple', () => {
    expectEqualIgnoreSpaces(transform(`
    Feature: My First Test
      Scenario: Navigates on click
        Given a user visits "https://example.cypress.io"
        When they click the link labeled "type"
        Then the URL should include '/commands/actions'
    
      Scenario: Types and asserts
        Given a user visits "https://example.cypress.io/commands/actions"
        When they type "fake@email.com" into the ".action-email" input
        Then the '.action-email' input has "fake@email.com" as its value
    `),
    `
      import { Given, given, When, when, Then, then, scenario, feature } from '@hypercubed/cypress-gherkin';

      Given('a user visits {string}', (a: string) => {

      });

      When('they click the link labeled {string}', (a: string) => {

      });

      Then('the URL should include {string}', (a: string) => {

      });

      When('they type {string} into the {string} input', (a: string, b: string) => {

      });

      Then('the {string} input has {string} as its value', (a: string, b: string) => {

      });

      feature('My First Test', () => {
        scenario('Navigates on click', () => {
          given('a user visits "https://example.cypress.io"');
          when('they click the link labeled "type"');
          then('the URL should include "/commands/actions"');
        });

        scenario('Types and asserts', () => {
          given('a user visits "https://example.cypress.io/commands/actions"');
          when('they type "fake@email.com" into the ".action-email" input');
          then('the ".action-email" input has "fake@email.com" as its value');
        });
      });

      `);
  });

  it('And and but', () => {
    expectEqualIgnoreSpaces(transform(`
    Feature: My First Test
      Scenario: Navigates on click
        Given a user visits "https://example.cypress.io"
          And something
        When they click the link labeled "type"
        Then the URL should include '/commands/actions'
          But something else
    `),
    `
    import { Given, given, and, When, when, Then, then, but, scenario, feature } from '@hypercubed/cypress-gherkin';

    Given('a user visits {string}', (a: string) => {
    
    });
    
    Given('something', () => {
    
    });
    
    When('they click the link labeled {string}', (a: string) => {
    
    });
    
    Then('the URL should include {string}', (a: string) => {
    
    });
    
    Then('something else', () => {
    
    });
    
    feature('My First Test', () => {
      scenario('Navigates on click', () => {
        given('a user visits "https://example.cypress.io"');
        and('something');
        when('they click the link labeled "type"');
        then('the URL should include "/commands/actions"');
        but('something else');
      });
    });

      `);
  });

  it('Background and Rules', () => {
    expectEqualIgnoreSpaces(transform(`
    Feature: My First Test
      Background:
        Given the background

      Rule: A rule

        Scenario: Navigates on click
          Given a user visits "https://example.cypress.io"

        Scenario: Types and asserts
          Given a user visits "https://example.cypress.io/commands/actions"
    `),
    `
    import { Given, given, background, scenario, rule, feature } from '@hypercubed/cypress-gherkin';

    Given('the background', () => {
    
    });

    Given('a user visits {string}', (a: string) => {
    
    });
    
    feature('My First Test', () => {
      background(() => {
        given('the background');
      });

      rule('A rule', () => {
        scenario('Navigates on click', () => {
          given('a user visits "https://example.cypress.io"');
        });
        
        scenario('Types and asserts', () => {
          given('a user visits "https://example.cypress.io/commands/actions"');
        });
      });
    });

      `);
  });

  it('ScenarioOutline');
});
