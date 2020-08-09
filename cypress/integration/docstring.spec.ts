import { When, Then, feature, scenario, when, then, gherkin } from '../../src/index';

function content(docString: any) {
  return docString.content || docString;
}

let snippet: string | null;

When('I use DocString like this', (dataString: any) => {
  snippet = content(dataString);
});

Then('I can interpret it as a string', () => {
  expect(snippet).to.be.a('string');
  snippet = null;
});

gherkin(`
  Feature: Using DocString in Gherkin text
    Scenario: DocString
      When I use DocString like this
      """
      <div>
        <h1>Hello</h1>
      </div>
      """
      Then I can interpret it as a string
`);

feature('Using DocString in Gherkin syntax', () => {
  scenario('DocString', () => {
    when('I use DocString like this', `
      <div>
        <h1>Hello</h1>
      </div>
    `);
    then('I can interpret it as a string');
  });
});
