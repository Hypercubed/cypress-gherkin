import { resolveFirst } from '../../src/definitions';
import '../support/gherkin-steps/common';

function match(text: string, args?: any) {
  const resolved = resolveFirst('*', text);
  assert.isOk(resolved, text);
  if (resolved && args) {
    const _args = resolved.expression
      .match(text)
      .map((_match) => _match.getValue(null));

    assert.deepEqual(args, _args);
  }
}

describe('phrases', () => {
  it('matches visit', () => {
    match('visit "https://example.cypress.io"', ['https://example.cypress.io']);
    match('I visit "https://example.cypress2.io"', ['https://example.cypress2.io']);
    match('a user visits "https://example.cypress.io"', ['https://example.cypress.io']);
    match('I open "https://example.cypress4.io"', ['https://example.cypress4.io']);
    match('the user open "https://example.cypress.io"', ['https://example.cypress.io']);

    match('visit the "https://example.cypress5.io"', ['https://example.cypress5.io']);
    match('I visit the "https://example.cypress.io" page', ['https://example.cypress.io']);
  });

  it('matches click', () => {
    match('I click "hello"', ['hello']);
    match('a user clicks "world"', ['world']);
    match('I click the "hello world" button', ['hello world']);
    match('the user clicks on "hello"', ['hello']);
    match('a user clicks on the "hello" link', ['hello']);
  });

  it('matches type', () => {
    match('I type "fake@email.com" in ".action-email"', ['fake@email.com', '.action-email']);
    match('a user types "hello world" in ".action-email"', ['hello world', '.action-email']);
    match('the user types "fake@email.com" into the "button.my-button" element', ['fake@email.com', 'button.my-button']);
  });

  it('matches wait', () => {
    match('wait for "@post"', ['@post']);
    match('I wait for "@post"', ['@post']);
    match('wait for "1000"', ['1000']);
    match('the user waits for "@post"', ['@post']);
  });

  it('matches url', () => {
    match('should be on "actions"', ['actions']);
    match('I am on "command/actions"', ['command/actions']);
    match('I should be on "actions"', ['actions']);
    match('I should be on the "actions" page', ['actions']);
    match('the user should be on "actions"', ['actions']);
  });

  it('matches title', () => {
    match('should see "Cypress" in the page title', ['Cypress']);
    match('I see "Google | Home" in the title', ['Google | Home']);
    match('a user sees "Cypress" in the window title', ['Cypress']);
    match('the user sees "Cypress" in the page title', ['Cypress']);
  });

  it('matches see', () => {
    match(`I see "hello"`, ['hello']);
    match(`the user sees "hello"`, ['hello']);
    match(`a user sees the "hello" button`, ['hello']);
  });

  it('matches value', () => {
    match(`the "#username" element should has "hello" as its value`, ['#username', 'hello']);
    match(`the "#name" input should have "hello" as its value`, ['#name', 'hello']);
    match(`"#name" should have "hello" as its value`, ['#name', 'hello']);
    match(`"#name" has "hello" as its value`, ['#name', 'hello']);
  });

  it('matches scroll', () => {
    match( 'scroll to the top', ['top']);
    match(`I scroll to the bottom of the page`, ['bottom']);
    match( 'the user scrolls to the top', ['top']);
  });
});
