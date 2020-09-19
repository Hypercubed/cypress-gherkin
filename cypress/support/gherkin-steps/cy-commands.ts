import { Step } from '../../../src/definitions';
import './properties';

/*
 * Rules: 
 * All steps in third-person point of view.
 * Given/When/Then steps should use present tense
 * Third person (the user) optional
 */

Step('*', '(the user )visits {string}', cy.visit);

Step('*', '(the user )focuses on {string}', (selector: string) => {
  const subject = selector.startsWith('@') ? cy.get(selector) : cy.contains(selector);
  subject.focus();
});

Step('*', '(the user ){_click_}s', (action: string) => {
  switch (action) {
    case 'click':
      cy.focused().click();
      break;
    case 'doubleclick':
      cy.focused().dblclick();
      break;
    case 'rightclick':
      cy.focused().dblclick();
      break;
  }
});

Step('*', '(the user ){_click_}s on {string}', (action: string, selector: string) => {
  const subject = selector.startsWith('@') ? cy.get(selector) : cy.contains(selector);
  switch (action) {
    case 'click':
      subject.click();
      break;
    case 'doubleclick':
      subject.dblclick();
      break;
    case 'rightclick':
      subject.dblclick();
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

Step('*', '(the user )types {string}', (value: string) => {
  cy.focused().type(value);
});

Step('*', '(the user )types {string} into {string}', (value: string, selector: string) => {
  const subject = selector.startsWith('@') ? cy.get(selector) : cy.contains(selector);
  subject.type(value);
});

Step('*', '(the user )clears {string}', (selector: string) => {
  const subject = selector.startsWith('@') ? cy.get(selector) : cy.contains(selector);
  subject.clear({ force: true });
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

Step('*', '(the user )scrolls to {string}', (selector: string) => {
  const subject = selector.startsWith('@') ? cy.get(selector) : cy.contains(selector);
  subject.scrollIntoView();
});

// '(the user )scrolls to the {_position_} of the element {string}'

