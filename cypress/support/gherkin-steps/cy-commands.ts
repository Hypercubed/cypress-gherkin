import { Step } from '../../../src/definitions';
import './properties';

/*
 * Rules: 
 * All steps in third-person point of view.
 * Given/When/Then steps should use present tense
 * Third person (the user) optional
 */

Step('*', '(the user )visits {string}', cy.visit);

Step('*', '(the user ){_click_}s on( the element) {string}', (action: string, selector: string) => {
  switch (action) {
    case 'click':
      cy.get(selector).click();
      break;
    case 'doubleclick':
      cy.get(selector).dblclick();
      break;
    case 'rightclick':
      cy.get(selector).dblclick();
      break;
  }
});

Step('*', '(the user )scrolls to the {_position_} of the page', (direction: string) => {
  let windowObj: Window;
  cy.window()
    .then((win) => {
      windowObj = win;
      return cy.get('body');
    })
    .then((body) => {
      const { scrollHeight } = body[0];
      const px = direction === 'top' ? 0 : scrollHeight + 100;

      windowObj.scrollTo(0, px);
    });
});

Step('*', '(the user )types {string} in( the element) {string}', (value: string, selector: string) => {
  cy.get(selector).first().type(value);
});

Step('*', '(the user )clears( the element) {string}', (selector: string) => {
  cy.get(selector).clear({ force: true });
});

Step('*', '(the user )waits for {int}ms', (ms: number) => {
  cy.wait(ms);
});

Step('*', '(the user )waits for {string}', (alias: string) => {
  cy.wait(alias);
});

Step('*', '(the user )presses {word}', (key: string) => {
  cy.focused().type(`{${key}}`);
});

Step('*', '(the user )presses {word} in {string}', (key: string, selector: string) => {
  cy.get(selector).type(`{${key}}`);
});

Step('*', '(the user )scrolls to( the element) {string}', (selector: string) => {
  cy.get(selector).scrollIntoView();
});

// '(the user )scrolls to the {_position_} of the element {string}'

