import { Step, ParameterType } from './definitions';
import { execute, gherkin } from './runner';

export { transform } from './transform';

export const Given = Step.bind(null, 'Given');
export const When = Step.bind(null, 'When');
export const Then = Step.bind(null, 'Then');

export const feature = describe;
export const rule = describe;
export const scenario = it;
export const example = it;
export const background = beforeEach;

export const given = execute.bind(null, 'Given');
export const when = execute.bind(null, 'When');
export const then = execute.bind(null, 'Then');
export const and = execute.bind(null, 'And');
export const but = execute.bind(null, 'But');

export const scenarioOutline = describe;
export const scenarioTemplate = describe;

export const outline = (fn: any) => {
  beforeEach(() => {
    cy.wrap(fn).as('cypress_gherkin_template');
  });
};

export const template = outline;

const examplesToHash = (_example: any[][]) => {
  const heading = _example.splice(0, 1)[0];
  return _example.map((row: any) => {
    return heading.reduce((acc: Record<string, any>, key: string, i: number) => {
      acc[key] = row[i];
      return acc;
    }, {});
  });
}

export const examples = (name: string, _example: any[]) => {
  const hashs = examplesToHash(_example);

  describe(name || '', () => {
    hashs.forEach((hash, index) => {
      it(`example #${index + 1}`, function () {
        return this.cypress_gherkin_template(hash);
      });
    });
  });
};

export { ParameterType, gherkin };
