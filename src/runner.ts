import Parser from '@cucumber/gherkin/dist/src/Parser';
import AstBuilder from '@cucumber/gherkin/dist/src/AstBuilder';
import { Incrementing, isJquery, getElements } from './utils';
import { resolve, generateHint } from './definitions';

const nextId = Incrementing();

const parser = new Parser(new AstBuilder(nextId));

export const execute = (_type: string, text: string, ..._args: any[]) => {
  const resolved = resolve(_type, text);
  if (resolved) {
    let args = resolved.expression.match(text).map(match => match.getValue(null));
    args = [...args, ..._args];

    const fn = resolved.implementation;

    const consoleProps = (value: any) => () => {
      return {
        Text: text,
        Function: fn.name || undefined,
        Args: args || [],
        Contents: fn.toString(),
        Yielded: isJquery(value) ? getElements(value) : value,
      }
    };

    let log = resolved.options.log;

    if (log) {
      cy.then(() => {
        log = Cypress.log({
          name: _type,
          message: `${_type}, ${text}`
        });
        log.snapshot('before', { at: 0 });
      });
    }
    
    let value = fn.apply(null, args);
    value = Cypress.isCy(value) ? value : cy.wrap(value);

    if (log) {
      return value.then((val: any) => {
        log.set({
          consoleProps: consoleProps(val)
        });

        log.snapshot('after', { at: 1 });   
        return val;
      });
    }

    return value;
  } else {
    // return Cypress.Promise.(new Error(generateHint(_type.trim(), text)));
    // return cy.then(() => {
      const err = new Error(generateHint(_type.trim(), text));
      // err.stack = undefined;
      throw err;
    // });
  }
};

const gherkinDoStep = (step: any) => {
  const args = [step.dataTable, step.docString].filter(e => e);
  execute(step.keyword, step.text, ...args);
};

const gherkinChild = (child: any) => {
  const type = child.value;
  switch (type) {
    case 'feature':
    case 'rule':
      describe(child[type].name || '', () => {
        child.rule.children.forEach(gherkinChild);
      });
      break;
    case 'scenario':
      it(child.scenario.name || '', () => {
        child.scenario.steps.forEach(gherkinDoStep);
      });
      break;
    case 'background':
      beforeEach(() => {
        child.background.steps.forEach(gherkinDoStep);
      });
      break;          
  }
};

export const gherkin = (text: string) => {
  const ast = parser.parse(text);

  if (ast.feature) {
    const { name, children } = ast.feature;
    describe(name || '', () => {
      if (children) {
        children.forEach(gherkinChild);
      }
    });
  }
}