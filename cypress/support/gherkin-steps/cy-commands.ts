import { Step } from '../../../src/definitions';

/*
 * Rules: 
 * All steps in third-person point of view.
 * Given/When/Then steps should use present tense
 */

Step('*', 'the user visits {string}', cy.visit);

Step('*', /^the user (click|doubleclick)s on the element "([^"]*)?"$/, (action: string, selector: string) => {
  if (action === 'click') {
    cy.get(selector).click();
  } else {
    cy.get(selector).dblclick();
  }
});

Step('*', 'the user scrolls to the {word} of the page', (direction: string) => {
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

Step('*', 'the user types {string} in the element {string}', (value: string, selector: string) => {
  cy.get(selector).first().type(value);
});

Step('*', 'the user clears the element {string}', (selector: string) => {
  cy.get(selector).clear({ force: true });
});

Step('*', 'the user waits for {int}ms', (ms: number) => {
  cy.wait(ms);
});

Step('*', 'the user waits for {string}', (alias: string) => {
  cy.wait(alias);
});

Step('*', 'the user presses {string}', (key: string) => {
  cy.focused().type(`{${key}}`);
});

Step('*', 'the user scrolls to the element {string}', (selector: string) => {
  cy.get(selector).scrollIntoView();
});
