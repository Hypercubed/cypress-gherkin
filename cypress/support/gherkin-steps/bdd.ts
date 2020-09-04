import { Then } from '../../../src/index';
import './properties';

/*
 * Rules: 
 * All steps in third-person point of view.
 * Given/When/Then steps should use present tense
 * use should/should not
 */

Then('the {_subject_} {should} be/equal {string}', (subject: string, should: boolean, title: string) => {
  // @ts-ignore
  const s = cy[subject]();
  s.should(should ? 'equal' : 'not.equal', title);
});

Then('the {_subject_} {should} contain {string}', (subject: string, should: boolean, title: string) => {
  // @ts-ignore
  const s = cy[subject]();
  s.should(should ? 'contain' : 'not.contain', title);
});

Then('execute the task {word}', (event:  string) => {
  cy.task(event);
});

Then('execute the command {string}', (command:  string) => {
  cy.task(command);
});

Then('capture the current screenshot', () => {
  cy.screenshot();
});
