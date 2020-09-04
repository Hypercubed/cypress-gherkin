import { Then } from '../../../src/index';
import './properties';

/*
 * Rules: 
 * All steps in third-person point of view.
 * Given/When/Then steps should use present tense
 * use should/should not
 * Subject (the element) optional
 */

Then('(the element ){string} {should} have {_data_} {string} with value {string}', (selector: string, should: boolean, type: string,  prop: string, value: string) => {
  cy.get(selector).should(should ? `have.${type}` : `not.have.${type}`, prop, value);
});

Then('(the element ){string} {should} have {_value_} {string}', (selector: string, should: boolean, type: string, cls: string) => {
  cy.get(selector).should(should ? `have.${type}` : `not.have.${type}`, cls);
});

Then('(the element ){string} {should} be {_state_}', (selector: string, should: boolean, state: string) => {
  cy.get(selector).should(should ? `be.${state}` : `not.be.${state}`);
});

Then('(the element ){string} {should} exist', (selector: string, should: boolean) => {
  cy.get(selector).should(should ? 'exist' : 'not.exist');
});

Then('(the element ){string} {should} match {string}', (selector: string, should: boolean, value: string) => {
  cy.get(selector).should(should ? 'match' : 'not.match', value);
});

Then('(the element ){string} {should} contain {string}', (selector: string, should: boolean, text: string) => {
  cy.get(selector).should(should ? 'contain' : 'not.contain', text);
});

Then('(the element ){string} {should} have descendants {string}', (selector: string, should: boolean, descendants: string) => {
  cy.get(selector).should(should ? 'have.descendants' : 'not.have.descendants', descendants);
});