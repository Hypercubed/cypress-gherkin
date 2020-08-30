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

/*
 * Rules: Use thrid person ("the user")
 * Given steps should use past or present-perfect tense
 * When steps should use present tense
 * Then steps should use present
 */

describe('gherkin-steps', () => {
  describe('commmands', () => {
    it('visit', () => {
      match('the user visits "https://example.cypress.io"', ['https://example.cypress.io']);
    });
  
    it('click', () => {
      match('the user clicks on the element ".hello"', ['click', '.hello']);
    });

    it('wait', () => {
      match('the user waits for "@post"', ['@post']);
      match('the user waits for 100ms', [100]);
    });

    it(' type', () => {
      match('the user types "fake@email.com" in the element ".action-email"', ['fake@email.com', '.action-email']);
    });

    it('scroll', () => {
      match(`the user scrolls to the bottom of the page`, ['bottom']);
      match(`the user scrolls to the top of the page`, ['top']);
    });
  });

  describe('bbd assertions', () => {
    it('is', () => {
      match('the url is "actions"', ['url', null, 'actions']);
      match('the title is not "actions"', ['title', ' not', 'actions']);
      match('the hash is "actions"', ['hash', null, 'actions']);
    });

    it('contain', () => {
      match('the url contains "actions"', ['url', null, 'actions']);
      match('the title does not contain "actions"', ['title', ' does not', 'actions']);
      match('the hash contains "actions"', ['hash', null, 'actions']);
    });
  });

  describe('chai-jquery', () => {
    it('value', () => {
      match(`the element "#username" has attr "hello" with value "world"`, ['#username', null, 'attr', 'hello', 'world']);
      match(`the element "#username" does not have css "hello" with value "world"`, ['#username', ' does not', 'css', 'hello', 'world']);
      match(`the element "#username" has prop "hello" with value "world"`, ['#username', null, 'prop', 'hello', 'world']);
      match(`the element "#username" does not have data "hello" with value "world"`, ['#username', ' does not', 'data', 'hello', 'world']);
    });

    it('has', () => {
      match(`the element "#username" has class "hello"`, ['#username', null, 'class', 'hello']);
      match(`the element "#username" does not have id "hello"`, ['#username', ' does not', 'id', 'hello']);
      match(`the element "#username" has html "hello"`, ['#username', null, 'html', 'hello']);
      match(`the element "#username" does not have text "hello"`, ['#username', ' does not', 'text', 'hello']);
    });

    it('is', () => {
      match(`the element "#username" is visible`, ['#username', null, 'visible']);
      match(`the element "#username" is not enabled`, ['#username', ' not', 'enabled']);
    });

    it('exists', () => {
      match(`the element "hello" exists`, ['hello', null]);
      match(`the element "hello" does not exist`, ['hello', ' does not']);
    });

    it('match', () => {
      match(`the element "hello" matches "world"`, ['hello', null, 'world']);
      match(`the element "hello" does not match "world"`, ['hello', ' does not', 'world']);
    });

    it('contain', () => {
      match(`the element "hello" contains "world"`, ['hello', null, 'world']);
      match(`the element "hello" does not contain "world"`, ['hello', ' does not', 'world']);
    });
  });
});
