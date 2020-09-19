import { given, when, then } from '@hypercubed/cypress-gherkin';

import { resolveFirst } from '../../src/definitions';
import '../support/gherkin-steps';

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
      match('the user clicks', ['click']);
      match('the user clicks on "hello"', ['click', 'hello']);
    });

    it('wait', () => {
      match('the user waits for "@post"', ['@post']);
      match('the user waits for 100ms', [100]);
    });

    it(' type', () => {
      match('the user types "fake@email.com"', ['fake@email.com']);
      match('the user types "fake@email.com" into "@action-email"', ['fake@email.com', '@action-email']);
    });

    it('scroll', () => {
      match(`the user scrolls to the bottom of the page`, ['bottom']);
      match(`the user scrolls to the top of the page`, ['top']);
    });
  });

  describe('bbd assertions', () => {
    it('is', () => {
      match('the url should be "actions"', ['url', true, 'actions']);
      match('the title should not be "actions"', ['title', false, 'actions']);
      match('the hash should equal "actions"', ['hash', true, 'actions']);
    });

    it('contain', () => {
      match('the url should contain "actions"', ['url', true, 'actions']);
      match('the title should not contain "actions"', ['title', false, 'actions']);
      match('the hash should contain "actions"', ['hash', true, 'actions']);
    });
  });

  describe('chai-jquery', () => {
    it('value', () => {
      match(`the element "#username" should have attr "hello" with value "world"`, ['#username', true, 'attr', 'hello', 'world']);
      match(`the element "#username" should not have css "hello" with value "world"`, ['#username', false, 'css', 'hello', 'world']);
      match(`the element "#username" should have prop "hello" with value "world"`, ['#username', true, 'prop', 'hello', 'world']);
      match(`the element "#username" should not have data "hello" with value "world"`, ['#username', false, 'data', 'hello', 'world']);
    });

    it('has', () => {
      match(`the element "#username" should have class "hello"`, ['#username', true, 'class', 'hello']);
      match(`the element "#username" should not have id "hello"`, ['#username', false, 'id', 'hello']);
      match(`the element "#username" should have html "hello"`, ['#username', true, 'html', 'hello']);
      match(`the element "#username" should not have text "hello"`, ['#username', false, 'text', 'hello']);
    });

    it('is', () => {
      match(`the element "#username" should be visible`, ['#username', true, 'visible']);
      match(`the element "#username" should not be enabled`, ['#username', false, 'enabled']);
    });

    it('exists', () => {
      match(`the element "hello" should exist`, ['hello', true]);
      match(`the element "hello" should not exist`, ['hello', false]);
    });

    it('match', () => {
      match(`the element "hello" should match "world"`, ['hello', true, 'world']);
      match(`the element "hello" should not match "world"`, ['hello', false, 'world']);
    });

    it('contain', () => {
      match(`the element "hello" should contain "world"`, ['hello', true, 'world']);
      match(`the element "hello" should not contain "world"`, ['hello', false, 'world']);
    });
  });

  describe('alias', () => {
    it ('containing', () => {
      match('alias "#id" as "elm"', ['#id', 'elm']);
    });
    it ('parent', () => {
      match('alias "h1" in "heading" as "elm"', ['h1', 'heading', 'elm']);
    });
    it ('selector', () => {
      match('alias the element "id" as "elm"', ['id', 'elm']);
    });
  });

  describe('usage', () => {
    before(() => {
      cy.visit('https://example.cypress.io/commands/actions');
    });

    it ('simple', () => {
      given(`alias the element "h1" as "heading"`);
      then(`"@heading" should contain "Actions"`);
      cy.get('@heading').should('have.length', 1);
    });

    it ('parent', () => {
      given(`alias "p" in ".banner" as "paragraph"`);
      then(`"@paragraph" should contain "Examples"`);
      cy.get('@paragraph').should('have.length', 1);
    });

    it ('containing', () => {
      given(`alias "Commands" as "dropdown"`);
      then(`"@dropdown" should have class "dropdown-toggle"`);
      cy.get('@dropdown').should('have.length', 1);
    });

    it ('focused', () => {
      given(`alias the element "#email1" as "input"`);
      when(`focuses on "@input"`);
      then(`the element "@input" should be focused`);
    });
  });
});
