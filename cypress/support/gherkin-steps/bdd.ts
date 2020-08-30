import { Then } from '../../../src/index';

/*
 * Rules: 
 * All steps in third-person point of view.
 * Given/When/Then steps should use present tense
 * Don't include should
 */

Then(/^the (title|url|hash) is( not)* "([^"]*)?"$/, (subject: string, not: boolean, title: string) => {
  // @ts-ignore
  const s = cy[subject]();
  s.should(not ? 'not.equal' : 'equal', title);
});

Then(/^the (title|url|hash)( does not)* contain(?:s)* "([^"]*)?"$/, (subject: string, not: boolean, title: string) => {
  // @ts-ignore
  const s = cy[subject]();
  s.should(not ? 'not.contain' : 'contain', title);
});
