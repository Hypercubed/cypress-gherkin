import { resolveFirst } from '../../src/definitions';

import '../support/gherkin-steps/bdd';
import '../support/gherkin-steps/chai-jquery';
import '../support/gherkin-steps/cy-commands';

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

describe('gherkin-steps', () => {
  describe('commmands', () => {
    it('visit', () => {
      match('I visit "https://example.cypress.io"', ['https://example.cypress.io']);
    });
  
    it('click', () => {
      match('I click on the element ".hello"', ['click', '.hello']);
    });

    it('wait', () => {
      match('I wait for "@post"', ['@post']);
      match('I wait for 100ms', [100]);
    });

    it(' type', () => {
      match('I type "fake@email.com" in the element ".action-email"', ['fake@email.com', '.action-email']);
    });

    it('scroll', () => {
      match(`I scroll to the bottom of the page`, ['bottom']);
      match(`I scroll to the top of the page`, ['top']);
    });
  });

  describe('bbd assertions', () => {
    it('url', () => {
      match('the url should be "actions"', [null, 'actions']);
      match('the url should not be "actions"', [' not', 'actions']);
    });

    it('title', () => {
      match('the title should be "Cypress"', [null, 'Cypress']);
      match('the title should not be "Cypress"', [' not', 'Cypress']);
    });
  });

  describe('chai-jquery', () => {
    it('exists', () => {
      match(`the element "hello" exists`, ['hello']);
      match(`the element "hello" does exist`, ['hello', null]);
      match(`the element "hello" does not exist`, ['hello', ' not']);
    });

    it('value', () => {
      match(`the element "#username" has value "hello"`, ['#username', 'value', 'hello']);
    });
  });
});
