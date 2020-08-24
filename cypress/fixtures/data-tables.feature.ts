import { feature, scenario, when, When, then, Then } from '@hypercubed/cypress-gherkin';

When('the following table is transposed:', () => {

});

Then('it should be:', () => {

});

feature('Data Tables', () => {
  scenario('transposed table', () => {
    when('the following table is transposed:', [
      [ 'a', 'b' ],
      [ '1', '2' ]
    ]);
    then('it should be:', [
      [ 'a', '1' ],
      [ 'b', '2' ]
    ]);
  });
});
