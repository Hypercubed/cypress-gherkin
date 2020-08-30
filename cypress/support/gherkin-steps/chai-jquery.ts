import { Then } from '../../../src/index';

/*
 * Rules: 
 * All steps in third-person point of view.
 * Given/When/Then steps should use present tense
 */

Then(/^the element "([^"]*)?"( does not)* ha(?:s|ve) (attr|prop|css|data) "([^"]*)?" with value "([^"]*)?"$/, (selector: string, not: string, type: string,  prop: string, value: string) => {
  cy.get(selector).should(`${not ? 'not.' : ''}have.${type}`, prop, value);
});

Then(/^the element "([^"]*)?"( does not)* ha(?:s|ve) (class|id|html|text|value) "([^"]*)?"$/, (selector: string, not: string, type: string, cls: string) => {
  cy.get(selector).should(`${not ? 'not.' : ''}have.${type}`, cls);
});

Then( /^the element "([^"]*)?" is( not)* (visible|enabled|disabled|selected|checked|empty)$/, (selector: string, not: string, state: string) => {
  cy.get(selector).should(`${not ? 'not.' : ''}${state}`);
});

Then(/^the element "([^"]*)?"( does not)* exist(?:s)*$/, (selector: string, not: string) => {
  cy.get(selector).should(not ? 'not.exist' : 'exist');
});

Then(/^the element "([^"]*)?"( does not)* match(?:es)* "([^"]*)?"$/, (selector: string, not: string, value: string) => {
  cy.get(selector).should(not ? 'not.match' : 'match', value);
});

Then(/^the element "([^"]*)?"( does not)* contain(?:s)* "([^"]*)?"$/, (selector: string, not: string, text: string) => {
  cy.get(selector).should(not ? 'not.contain' : 'contain', text);
});

Then(/^the element "([^"]*)?"( does not)* ha(?:s|ve) descendants "([^"]*)?"$/, (selector: string, not: string, descendants: string) => {
  cy.get(selector).should(not ? 'not.have.descendants' : 'have.descendants', descendants);
});