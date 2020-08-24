import { Given, When, Then, feature, scenario, given, when, then, gherkin } from '../../src/index';
import { messages } from '@cucumber/messages';

type DataTable = messages.GherkinDocument.Feature.Step.DataTable;
const DataTable = messages.GherkinDocument.Feature.Step.DataTable;

function rawTable(dataTable: DataTable) {
  if (dataTable instanceof DataTable) {
    return dataTable.rows.map(row => {
      return row.cells?.map(cell => {
        return cell.value;
      });
    });
  }
  
  return dataTable;
}

function transpose(table: any): DataTable {
  return table[0].map((x, i) => table.map((y) => y[i]))
}

const steps = {
  when: (arg: DataTable) => {
    result = transpose(rawTable(arg));
  },
  then: (arg: DataTable) => {
    expect(rawTable(arg)).to.deep.equal(result);
  }
}

let result: any = null;

When('the following table is transposed:', (arg) => steps.when(arg));

Then('it should be:', (arg) => steps.then(arg));

describe('Data Tables', () => {
  beforeEach(() => {
    cy.spy(steps, 'when').as('When');
    cy.spy(steps, 'then').as('Then');
  });

  describe('gherkin text', () => {
    beforeEach(() => {
      result = null;

      cy.stub(window, 'describe', (_name, fn) => fn()).as('describe');
      cy.stub(window, 'it', (_name, fn) => fn()).as('it');
      cy.stub(window, 'beforeEach', (_name, fn) => fn()).as('beforeEach');
    });

    it('runs gherkin text', () => {
      gherkin(`
        
      Feature: Data Tables
        Data Tables can be places underneath a step and will be passed as the last
        argument to the step definition. They can be used to represent richer data
        structures, and can also be transformed to other types.

        Scenario: transposed table
          When the following table is transposed:
            | a | b |
            | 1 | 2 |
          Then it should be:
            | a | 1 |
            | b | 2 |

      `);

      cy.get('@describe').should('callCount', 1);
      cy.get('@beforeEach').should('callCount', 0);
      cy.get('@it').should('callCount', 1);

      cy.get('@When').should('callCount', 1);
      cy.get('@Then').should('callCount', 1);

      cy.get('@When').should((_: any) => {
        const arg = _.firstCall.args[0];
        expect(arg).to.be.instanceOf(DataTable);
        expect(rawTable(arg)).to.deep.eq([ [ 'a', 'b' ], [ '1', '2' ] ]);
      });
      cy.get('@Then').should((_: any) => {
        const arg = _.firstCall.args[0];
        expect(arg).to.be.instanceOf(DataTable);
        expect(rawTable(arg)).to.deep.eq([ [ 'a', '1' ], [ 'b', '2' ] ]);
      });
    });
  });

  describe('gherkin syntax', () => {
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

        cy.get('@When').should('callCount', 1);
        cy.get('@Then').should('callCount', 1);

        cy.get('@When').should((_: any) => {
          const arg = _.firstCall.args[0];
          expect(arg).to.be.instanceOf(Array);
          expect(arg).to.deep.eq([ [ 'a', 'b' ], [ '1', '2' ] ]);
        });
        cy.get('@Then').should((_: any) => {
          const arg = _.firstCall.args[0];
          expect(arg).to.be.instanceOf(Array);
          expect(arg).to.deep.eq([ [ 'a', '1' ], [ 'b', '2' ] ]);
        });
      });
    });
  });
});
