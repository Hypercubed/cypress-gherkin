import { Given, When, Then, feature, scenario, background, given, when, then, gherkin } from '../../src/index';
import { messages } from '@cucumber/messages'

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

Given('I have a table with some escaped characters in it', (dataTable: any) => {
  console.log(dataTable);
  // we don't need to do anything, just make sure it doesn't break
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

    Scenario: New line character
      Given I have a table with some escaped characters in it
        | foo        | bar        |
        | foo\\nfoo  | bar\\nbar  |
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

  scenario('New line character', () => {
    const dataTable = [
      ['foo', 'bar'],
      ['foo\nfoo','bar\nbar'],
    ];

    given('I have a table with some escaped characters in it', dataTable);
  });
});