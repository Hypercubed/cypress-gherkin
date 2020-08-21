import Parser from '@cucumber/gherkin/dist/src/Parser';
import AstBuilder from '@cucumber/gherkin/dist/src/AstBuilder';
import { messages } from '@cucumber/messages';

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

// const gherkinDoStep = (step: any) => {
//   const args = [step.dataTable, step.docString].filter((e) => e);
//   execute(step.keyword, step.text, ...args);
// };

const gherkinOutline = (scenario: any) => {
  describe(scenario.name || '', () => {
    scenario.examples.forEach((example: any) => {
      const tableHeaderRegex = example.tableHeader.cells.map(
        (cell: any) => new RegExp(`<${cell.value}>`, 'g')
      ); // TODO: escape value

      it(example.name || '', () => {
        example.tableBody.forEach((tableRow: any) => {
          const values = tableRow.cells.map((cell: any) => cell.value);

          scenario.steps.forEach((step: any) => {
            let { text } = step;

            tableHeaderRegex.forEach((re: RegExp, i: number) => {
              text = text.replace(re, values[i]);
            });

            gherkinDoStep({
              ...step,
              text,
            });
          });
        });
      });
    });
  });
};

// const gherkinChild = (child: any) => {
//   const type = child.value;

//   switch (type) {
//     case 'feature':
//     case 'rule':
//       describe(child[type].name || '', () => {
//         child.rule.children.forEach(gherkinChild);
//       });
//       break;
//     case 'scenario':
//       if (child.scenario.examples && child.scenario.examples.length) {
//         gherkinOutline(child.scenario);
//       } else {
//         it(child.scenario.name || '', () => {
//           child.scenario.steps.forEach(gherkinDoStep);
//         });
//       }
//       break;
//     case 'background':
//       beforeEach(() => {
//         child.background.steps.forEach(gherkinDoStep);
//       });
//       break;
//   }
// };

// type GherkinDocument = messages.IGherkinDocument;
type Feature = messages.GherkinDocument.Feature;
type Rule = messages.GherkinDocument.Feature.FeatureChild.IRule;
type Scenario = messages.GherkinDocument.Feature.IScenario;
type Background = messages.GherkinDocument.Feature.IBackground;
type Step = messages.GherkinDocument.Feature.IStep;
type Examples = messages.GherkinDocument.Feature.Scenario.IExamples;

const walker = new Walker({
  visitFeature(feature: Feature, children: any[]) {
    return () => describe(feature.name || '', () => {
      children.forEach(fn => fn());
    });
  },
  visitStep(step: Step) {
    const args = [step.dataTable, step.docString].filter((e) => e);
    return () => execute(step.keyword || '*', step.text || '', ...args);
  },
  visitBackground(background: Background, steps: any[]) {
    return () => beforeEach(background.name || '', () => {
      steps.forEach(fn => fn());
    });
  },
  visitExample(steps: any[]) {
    return () => {
      steps.forEach(fn => fn());
    };
  },
  visitExamples(examples: Examples, children: any[]) {
    return () => it(examples.name || '', () => {
      children.forEach(fn => fn());
    });
  },
  visitScenarioOutline(scenario: Scenario, examples: any[]) {
    return () => describe(scenario.name || '', () => {
      examples.forEach(fn => fn());
    });
  },
  visitScenario(scenario: Scenario, steps: any[]) {
    return () => it(scenario.name || '', () => {
      steps.forEach(fn => fn());
    });
  },
  visitRule(rule: Rule, children: any[]) {
    return () => describe(rule.name || '', () => {
      children.forEach(fn => fn());
    });
  }
});

export const gherkin = (text: string) => {
  const ast = parser.parse(text);
  walker.walk(ast)();
};
