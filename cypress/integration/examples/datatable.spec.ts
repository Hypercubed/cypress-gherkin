import { When, Then, feature, scenario, when, then, gherkin } from '@hypercubed/cypress-gherkin';
import { messages } from '@cucumber/messages';

// you can have external state, and also require things!
let sum = 0;

function rawTable(dataTable: any) {
  if (dataTable instanceof messages.GherkinDocument.Feature.Step.DataTable) {
    return dataTable.rows.map(row => {
      return row.cells?.map(cell => {
        return cell.value;
      });
    });
  }
  
  return dataTable;
}

When('I add all following numbers', (dataTable: any) => {
  sum = rawTable(dataTable)
    .slice(1)
    .reduce(
      (rowA: any, rowB: any) =>
        rowA.reduce((a: any, b: any) => parseInt(a, 10) + parseInt(b, 10)) +
        rowB.reduce((a: any, b: any) => parseInt(a, 10) + parseInt(b, 10))
    );
});

Then('I verify the datatable result is equal to {int}', (result: number) => {
  expect(sum).to.equal(result);
});

gherkin(`
  Feature: Using DataTable in Gherkin text

    As a cucumber cypress plugin which handles DataTables
    I want to allow people to write DataTable scenarios and run it in cypress

    Scenario: DataTable
      When I add all following numbers
        | number | another number |
        | 1      | 2              |
        | 3      | 4              |
      Then I verify the datatable result is equal to 10
`)

/// ** OR **

feature('Using DataTable in Gherkin syntax', () => {
  scenario('DataTable', () => {
    const dataTable = [
      ['number', 'another number'],
      [1,2],
      [3,4]
    ];

    when('I add all following numbers', dataTable);
    then('I verify the datatable result is equal to 10');
  });
});
