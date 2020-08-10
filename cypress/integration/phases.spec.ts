import { resolve } from "../../src/definitions";
import { setupCommon } from "../../src/common";

setupCommon();

function match(text: string, args?: any) {
  const resolved = resolve('*', text);
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
    match('visit "https://example.cypress.io"');
    match('I visit "https://example.cypress2.io"');
    match('a user visits "https://example.cypress.io"');
    match('I open "https://example.cypress4.io"');
    match('the user open "https://example.cypress.io"');

    match('visit the "https://example.cypress5.io"');
    match('I visit the "https://example.cypress.io" page');
  });

  it('matches click', () => {
    match('I click "hello"');
    match('a user clicks "hello"');
    match('I click the "hello" button');
    match('the user clicks on "hello"');
    match('a user clicks on the "hello" link');
  });

  it('matches type', () => {
    match('I type "fake@email.com" in ".action-email"');
    match('a user types "fake@email.com" in ".action-email"');
    match('the user types "fake@email.com" into the ".action-email"');
  });

  it('matches wait', () => {
    match('wait for "@post"');
    match('I wait for "@post"');
    match('wait for "@post"');
    match('the user waits for "@post"');
  });

  it('matches url', () => {
    match('should be on "actions"');
    match('I am on "actions"');
    match('I should be on "actions"');
    match('I should be on the "actions" page');
    match('the user should be on "actions"');
  });

  it('matches title', () => {
    match('should see "Cypress" in the page title');
    match('I see "Cypress" in the title');
    match('a user sees "Cypress" in the window title');
    match('the user sees "Cypress" in the page title');
  });

  it('matches see', () => {
    match(`I see "hello"`);
    match(`the user sees "hello"`);
    match(`a user sees the "hello" button`);
  });

  it('matches value', () => {
    match(`the "#username" element should has "hello" as its value`);
    match(`the "#name" input should have "hello" as its value`);
    match(`"#name" should have "hello" as its value`);
    match(`"#name" has "hello" as its value`);
  });

  it('matches scroll', () => {
    match( 'scroll to the top');
    match(`I scroll to the bottom of the page`);
    match( 'the user scrolls to the top');
  });
});
