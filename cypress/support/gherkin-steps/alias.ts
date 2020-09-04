import { Step } from '../../../src/definitions';

Step('*', 'alias( the element)(s) {string} as {string}', (selector: string, alias: string) => {
  cy.get(selector).as(alias);
});

// TODO: alias the (first|second|3rd|last) ( element) {string} as {string}

Step('*', 'alias( the element)(s) containing {string} as {string}', (text: string, alias: string) => {
  cy.contains(text).as(alias);
});

// TODO: alias the (first|second|last) ( element) containing {string} as {string}

Step('*', 'alias the focused element(s) as {string}', (alias: string) => {
  cy.focused().as(alias);
});

Step('*', 'alias the root( the element) as {string}', (alias: string) => {
  cy.root().as(alias);
});