import { Step } from '../../../src/definitions';

/*
 * Rules: 
 * Present tense
 * Use selectors
 */

Step('*', 'alias/get {string} as {string}', (selector: string, alias: string) => {
  cy.contains(selector).as(alias);
});

Step('*', 'alias/get the element {string} as {string}', (selector: string, alias: string) => {
  cy.get(selector).as(alias);
});

Step('*', 'alias/get {string} in {string} as {string}', (selector: string, parent: string, alias: string) => {
  cy.get(parent).find(selector).as(alias);
});

// TODO: alias the (first|second|3rd|last) ( element) {string} as {string}
