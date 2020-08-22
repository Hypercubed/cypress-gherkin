import Parser from '@cucumber/gherkin/dist/src/Parser';
import AstBuilder from '@cucumber/gherkin/dist/src/AstBuilder';

import { Incrementing, isJquery, getElements } from './utils';
import { resolve, generateHint } from './definitions';
import { Walker } from './ast-walker';

const nextId = Incrementing();

const parser = new Parser(new AstBuilder(nextId));

export const execute = (_type: string, text: string, ..._args: any[]) => {
  const resolved = resolve(_type, text);
  if (resolved) {
    let args = resolved.expression
      .match(text)
      .map((match) => match.getValue(null));

    if (_args && _args.length) {
      args = args.concat(_args);
    }

    const fn = resolved.implementation;

    const consoleProps = (val: any) => () => {
      return {
        Text: text,
        Function: fn.name || undefined,
        Args: args || [],
        Contents: fn.toString(),
        Yielded: isJquery(val) ? getElements(val) : val,
      };
    };

    let log = resolved.options.log;

    return cy.then(async () => {
      if (log) {
        log = Cypress.log({
          name: _type,
          message: `${_type}, ${text}`,
        });
        log.snapshot('before', { at: 0 });
      }

      let value = fn.apply(null, args);
      value = Cypress.isCy(value) ? value : Promise.resolve(value);

      if (log) {
        return value.then((val: any) => {
          log.set({
            consoleProps: consoleProps(val),
          });

          log.snapshot('after', { at: 1 });

          return val;
        });
      }

      return value;
    });
  } else {
    const err = new Error(generateHint(_type.trim(), text));
    throw err;
  }
};

const walker = new Walker({
  visitFeature(feature, next) {
    return describe(feature.name || '', next);
  },
  visitStep(step) {
    const args = [step.dataTable, step.docString].filter((e) => e);
    return execute(step.keyword || '*', step.text || '', ...args);
  },
  visitBackground(background, next) {
    return beforeEach(background.name || '', next);
  },
  visitExample(_row, next) {
    return next();
  },
  visitExamples(examples, next) {
    return it(examples.name || '', next);
  },
  visitScenarioOutline(scenario, next) {
    return describe(scenario.name || '', next);
  },
  visitScenario(scenario, next) {
    return it(scenario.name || '', next);
  },
  visitRule(rule, next) {
    return describe(rule.name || '', next);
  }
});

export const gherkin = (text: string) => {
  const ast = parser.parse(text);
  walker.walk(ast);
};
